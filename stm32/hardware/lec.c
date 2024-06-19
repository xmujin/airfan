/**
 * @file lec.c
 * @author xiangbo (xx806181859@gmail.com)
 * @brief 控制灯泡
 * @version 1.0
 * @date 2024-06-07 16:06:37 
 * 
 * @copyright Copyright (c) 2024
 * 
 */

#include "stm32f10x.h"
#define RCC_PERIPH RCC_APB2Periph_GPIOB

void led_init(GPIO_TypeDef *GPIOx, uint16_t GPIO_Pin)
{
    RCC_APB2PeriphClockCmd(RCC_PERIPH, ENABLE);


    GPIO_InitTypeDef GPIO_InitStructure;
    GPIO_InitStructure.GPIO_Pin = GPIO_Pin;
    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;
    GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_Init(GPIOx, &GPIO_InitStructure);

}

/**
 * @brief 
 * @param GPIOx 对应gpio
 * @param GPIO_Pin 对应gpio引脚
 * @author xiangbo (xx806181859@gmail.com)
 * @date 2024-06-07 16:06:58 
 */
void led_open(GPIO_TypeDef *GPIOx, uint16_t GPIO_Pin)
{
    GPIO_WriteBit(GPIOx, GPIO_Pin, RESET);
}

/**
 * @brief 关闭灯泡
 * @param GPIOx 
 * @param GPIO_Pin 
 * @author xiangbo (xx806181859@gmail.com)
 * @date 2024-06-18 09:06:25 
 */
void led_close(GPIO_TypeDef *GPIOx, uint16_t GPIO_Pin)
{
    GPIO_WriteBit(GPIOx, GPIO_Pin, SET);
}