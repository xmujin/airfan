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

#define LED_PERIPH RCC_APB2Periph_GPIOA
#define LED_PORT GPIOA
#define LED_PIN GPIO_Pin_1

void delay(int x)
{
    for (int i = 0; i < x; i++)
    {
        for (int j = 0; j < 1000; j++)
            __NOP();
    }
}

int main()
{
    GPIO_InitTypeDef initStruct; 
	RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE); // 配置时钟GPIOA
	initStruct.GPIO_Pin = GPIO_Pin_0 ;
	initStruct.GPIO_Mode = GPIO_Mode_Out_PP;
	initStruct.GPIO_Speed = GPIO_Speed_50MHz;
	GPIO_Init(GPIOA, &initStruct);
	
    while (1)
    {
        GPIO_WriteBit(GPIOA, GPIO_Pin_0, Bit_SET);
        delay(2000);
        GPIO_WriteBit(GPIOA, GPIO_Pin_0, Bit_RESET);
        delay(2000);
    }
}
