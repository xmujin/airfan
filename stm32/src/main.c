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



// 挡位： 1， 2，3 档
uint8_t gearPos = 1;

/**
 * @brief 换挡
 * @param gearPos 
 * @author xiangbo (xx806181859@gmail.com)
 * @date 2024-07-02 21:07:72 
 */
void changeGearPos(uint8_t gearPos)
{
    OLED_Clear();
    if(gearPos == 1)
    {
        pwm_setCompare2(33);
        OLED_ShowString(1, 1, "current: one");
    }
    else if(gearPos == 2)
    {
        pwm_setCompare2(66);
        OLED_ShowString(1, 1, "current: two");
    }
    else if(gearPos == 3) 
    {
        pwm_setCompare2(100);
        OLED_ShowString(1, 1, "current: three");
    }
}



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
        changeGearPos(gearPos);
    }
    else if(strcmp(cmd, "fan_off") == 0)
    {
        pwm_setCompare2(0);
    }
    else if(strcmp(cmd, "fan_up") == 0)
    {
        gearPos++;
        if(gearPos > 3)
        {
            gearPos = 3;
        }
        changeGearPos(gearPos);

    }
    else if(strcmp(cmd, "fan_down") == 0)
    {
        gearPos--;
        if(gearPos < 1)
        {
            gearPos = 1;
        }
        changeGearPos(gearPos);
    }
    else if(strcmp(cmd, "one") == 0)
    {
        gearPos = 1;
        changeGearPos(gearPos);
    }
    else if(strcmp(cmd, "two") == 0)
    {
        gearPos = 2;
        changeGearPos(gearPos);
    }
    else if(strcmp(cmd, "three") == 0)
    {
        gearPos = 3;
        changeGearPos(gearPos);
    }

    
    

}




int main()
{

    pwm_init();
    //led_init(GPIOB, GPIO_Pin_5);
    //led_close(GPIOB, GPIO_Pin_5);
    //led_open(GPIOB, GPIO_Pin_5);
    OLED_Init();
    wifi_init(); // 初始化wifi串口
    bluetooth_init();
    OLED_ShowString(1, 1, "current: one");
    
    while (1)
    {
        if(blue_rxFlag == 1) // 接收到了从APP端传来的json数据
        {
            cJSON *json = cJSON_Parse(blue_rxPacket); // 解析json数据
            cJSON *type = cJSON_GetObjectItemCaseSensitive(json, "type");
            


            if(strcmp(type->valuestring, "wificmd") == 0) // 控制wifi命令,将其转发到wifi模块上
            {
                blue_sendByte(0xff);
                blue_sendJson(blue_rxPacket); // 将数据转发到WiFi模块上
                blue_sendByte(0xfe);
            }
            else if(strcmp(type->valuestring, "control") == 0)
            {

                cJSON *cmd = cJSON_GetObjectItemCaseSensitive(json, "cmd");
                controlFan(cmd->valuestring);
                OLED_ShowString(3, 1, cmd->valuestring);

            }
     


            cJSON_Delete(json); // 释放空间
            blue_clearRxPacket(blue_rxPacket);
            blue_rxFlag = 0;



        }

        if(wifi_rxFlag == 1) // 接收到了从wifi模块传来的json数据
        {

            cJSON *json = cJSON_Parse(wifi_rxPacket); // 解析json数据
            cJSON *type = cJSON_GetObjectItemCaseSensitive(json, "type");
            
            OLED_ShowString(2, 1, "receive:wifi");
            if(strcmp(type->valuestring, "information") == 0)
            {
                // 对于WiFi扫描信息，需要转发
                wifi_sendJson(wifi_rxPacket); //发送到蓝牙串口再到APP
                OLED_ShowString(3, 1, "wifi_message");
            }
            else if(strcmp(type->valuestring, "control") == 0)
            {
                // 对于控制信息，则直接控制风扇
                cJSON *cmd = cJSON_GetObjectItemCaseSensitive(json, "cmd");
                controlFan(cmd->valuestring);
                OLED_ShowString(3, 1, "control:wifi");
            }
            wifi_sendJson(wifi_rxPacket); //发送到蓝牙串口再到APP
            wifi_clearRxPacket(wifi_rxPacket); // 清空接收缓冲区
            wifi_rxFlag = 0;
            OLED_ShowString(4, 1, "finish");

        }
    }
}

