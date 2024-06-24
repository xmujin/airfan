/**
 * @file DHT11.c
 * @author xiangbo (xx806181859@gmail.com)
 * @brief 温湿度模块
 * @version 1.0
 * @date 2024-06-06 14:06:04 
 * 
 * @copyright Copyright (c) 2024
 * 
 */

#include "stm32f10x.h"
#include "Delay.h"
#include "DHT11.h"

#define DHT11_PORT GPIOA
#define DHT11_PIN GPIO_Pin_5



/**
 * @brief DHT11的GPIO的初始化
 * @author xiangbo (xx806181859@gmail.com)
 * @date 2024-06-06 14:06:34 
 */
void DHT11_init(void)
{
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);
    GPIO_InitTypeDef gpio_is;
    gpio_is.GPIO_Mode = GPIO_Mode_IN_FLOATING; // 浮空输入
    gpio_is.GPIO_Pin = DHT11_PIN;
    gpio_is.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_Init(DHT11_PORT, &gpio_is);
}



DHT11_detect DHT11_Read(void)
{
    DHT11_detect data = {0, 0};
    uint8_t buffer[5] = {0};

    // 配置GPIO为输出模式
    GPIO_InitTypeDef GPIO_InitStructure;
    GPIO_InitStructure.GPIO_Pin = DHT11_PIN;
    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;
    GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_Init(DHT11_PORT, &GPIO_InitStructure);

    // 启动信号
    GPIO_ResetBits(DHT11_PORT, DHT11_PIN);
    Delay_us(18000);  // 拉低至少18ms
    GPIO_SetBits(DHT11_PORT, DHT11_PIN);
    Delay_us(30);  // 拉高20-40us

    // 配置GPIO为输入模式
    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IN_FLOATING;
    GPIO_Init(DHT11_PORT, &GPIO_InitStructure);
    Delay_us(40);

    // 检测DHT11响应信号
    if (!GPIO_ReadInputDataBit(DHT11_PORT, DHT11_PIN)) {
        Delay_us(80);
        if (GPIO_ReadInputDataBit(DHT11_PORT, DHT11_PIN)) {
            Delay_us(80);
            for (int i = 0; i < 5; i++) {
                for (int j = 0; j < 8; j++) {
                    while (!GPIO_ReadInputDataBit(DHT11_PORT, DHT11_PIN));
                    Delay_us(30);
                    if (GPIO_ReadInputDataBit(DHT11_PORT, DHT11_PIN))
                        buffer[i] |= (1 << (7 - j));
                    while (GPIO_ReadInputDataBit(DHT11_PORT, DHT11_PIN));
                }
            }
        }
    }

    // 校验数据
    if (buffer[4] == (buffer[0] + buffer[1] + buffer[2] + buffer[3])) {
        data.humidity = buffer[0];
        data.temperature = buffer[2];
    }

    return data;
}