/*
 * ************************************************
 * 
 * STM32 blink demo
 * 
 * CPU:     STM32F103C8
 * PIN:     PA1
 * 
 * ************************************************
*/

#include "stm32f10x.h"
#include "OLED.h"
#include "Delay.h"
#include "timer.h"
#include "bluetooth.h"
#include "pwm.h"
#include "DHT11.h"
#include "led.h"
#include "wifi.h"
#include "cJSON.h"
#include <string.h>
#define LED_PERIPH RCC_APB2Periph_GPIOA
#define LED_PORT GPIOA
#define LED_PIN GPIO_Pin_1



/**
 * @brief 执行风扇控制命令
 * {
 *  type: control,
 *  cmd: 控制命令
 * }
 * @param cmd 
 * @author xiangbo (xx806181859@gmail.com)
 * @date 2024-06-27 10:06:47 
 */
void controlFan(const char * cmd)
{
    if(strcmp(cmd, "fan_on") == 0)
    {
        led_open(GPIOB, GPIO_Pin_5);
    }
    else if(strcmp(cmd, "fan_off") == 0)
    {
        led_close(GPIOB, GPIO_Pin_5);
    }

}



uint16_t i;
//uint16_t num = 0;
int main()
{
    led_init(GPIOB, GPIO_Pin_5);
    led_close(GPIOB, GPIO_Pin_5);
    //led_open(GPIOB, GPIO_Pin_5);
    OLED_Init();
    wifi_init(); // 初始化wifi串口
    bluetooth_init();
    //timer_init();
    //OLED_ShowString(1, 1, "nazzzsm is:");

    
    
    //OLED_ShowString(2, 1, "shabi");
    //pwm_init();                



    //uint8_t sb[] = "AT+NAME=xiangxun\r\n";
    //sendArray(sb, sizeof(sb));

    uint8_t a = 0;
    OLED_ShowString(2, 1, "123123");
    
    while (1)
    {
        if(blue_rxFlag == 1) // 接收到了从APP端传来的json数据
        {
            cJSON *json = cJSON_Parse(blue_rxPacket); // 解析json数据
            cJSON *type = cJSON_GetObjectItemCaseSensitive(json, "type");
            OLED_ShowString(3, 1, "aaa");


            if(strcmp(type->valuestring, "wificmd") == 0 || ) // 控制wifi命令,将其转发到wifi模块上
            {
                blue_sendByte(0xff);
                blue_sendJson(blue_rxFlag); // 将数据转发到WiFi模块上
                blue_sendByte(0xfe);
            }
            else if(strcmp(type->valuestring, "control") == 0)
            {

                cJSON *cmd = cJSON_GetObjectItemCaseSensitive(json, "cmd");
                controlFan(cmd->valuestring);
            }


            cJSON_Delete(json); // 释放空间
            blue_clearRxPacket(blue_rxPacket);
            blue_rxFlag = 0;



        }

        if(wifi_rxFlag == 1) // 接收到了从wifi模块传来的json数据
        {
            cJSON *json = cJSON_Parse(blue_rxPacket); // 解析json数据
            cJSON *type = cJSON_GetObjectItemCaseSensitive(json, "type");
            if(strcmp(type->valuestring, "information") == 0)
            {
                // 对于WiFi扫描信息，需要转发
                wifi_sendJson(wifi_rxPacket); //发送到蓝牙串口再到APP
                wifi_clearRxPacket(wifi_rxPacket); // 清空接收缓冲区
                wifi_rxFlag = 0;
            }
            else if(strcmp(type->valuestring, "control") == 0)
            {
                // 对于控制信息，则直接控制风扇
                cJSON *cmd = cJSON_GetObjectItemCaseSensitive(json, "cmd");
                controlFan(cmd->valuestring);
            }

        }


        // 接收从手机蓝牙传入单片机蓝牙上的命令
        // if(USART_GetFlagStatus(USART1, USART_FLAG_RXNE) == SET)
        // {
        //     a = USART_ReceiveData(USART1);
        //     if(a == 49)  // ascii 字符1
        //     {
        //         led_open(GPIOB, GPIO_Pin_5);
        //     }
        //     if(a == 50) // ascii 字符2
        //     {
        //         led_close(GPIOB, GPIO_Pin_5);
        //     } 
        //     if(a == 51) // 扫描wifi的指令
        //     {                  
        //         OLED_ShowNum(2, 1, 22, 2);
        //         blue_sendString("scan_wifi\n");
                
        //     }
        //     a = 0;
        // }

        // if(rxFlag == 1) // 获取到了扫描到的WiFi数据
        // {
        //     OLED_ShowNum(2, 1, 33, 2);
        //     wifi_sendJson(rxPacket);
        //     wifi_clearRxPacket(rxPacket);
        //     rxFlag = 0;
        // }




        //USART_ReceiveString(USART1, response, sizeof(response));
        //OLED_ShowString(2, 1, (char *)response);
        //DHT11_detect data = DHT11_Read();
        //OLED_ShowString(2, 1, (char *)response);
        
        //OLED_ShowNum(2, 9, data.temperature, 2);
        //OLED_ShowString(3, 1, "humidity: ");
        //OLED_ShowNum(3, 11, data.humidity, 2);
        // for (i = 0; i <= 100; i++)
        // {
        //     pwm_setCompare2(i);
        //     Delay_ms(15);
        // }

        // for (i = 0; i <= 100; i++)
        // {
        //     pwm_setCompare2(100 - i);
        //     Delay_ms(15);
        // }
        
    }
}

