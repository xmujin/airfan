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
#include "delay.h"


#define LED_PERIPH RCC_APB2Periph_GPIOA
#define LED_PORT GPIOA
#define LED_PIN GPIO_Pin_1



int main()
{
    // GPIO_InitTypeDef initStruct; 
	// RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE); // 配置时钟GPIOA
	// initStruct.GPIO_Pin = GPIO_Pin_0 ;
	// initStruct.GPIO_Mode = GPIO_Mode_Out_PP;
	// initStruct.GPIO_Speed = GPIO_Speed_50MHz;
	// GPIO_Init(GPIOA, &initStruct);
    // delay_init();
    // delay_ms(1000);
    OLED_Init();
    OLED_ShowString(1, 1, "Hello World!");
                         
    while (1)
    {

    }
}
