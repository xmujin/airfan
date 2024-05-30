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
#include "pwm.h"
#define LED_PERIPH RCC_APB2Periph_GPIOA
#define LED_PORT GPIOA
#define LED_PIN GPIO_Pin_1

uint16_t i;
uint16_t num = 0;
int main()
{
    OLED_Init();
    //timer_init();
    OLED_ShowString(1, 1, "num is:");
    pwm_init();                



    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);
    GPIO_InitTypeDef gpio_is;
    gpio_is.GPIO_Mode = GPIO_Mode_Out_PP; // 复用推挽输出
    gpio_is.GPIO_Pin = GPIO_Pin_6;
    gpio_is.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_Init(GPIOA, &gpio_is);
    GPIO_WriteBit(GPIOA, GPIO_Pin_6, Bit_SET);






    while (1)
    {
        for (i = 0; i <= 100; i++)
        {
            pwm_setCompare2(i);
            Delay_ms(15);
        }

        for (i = 0; i <= 100; i++)
        {
            pwm_setCompare2(100 - i);
            Delay_ms(15);
        }
        
    }
}

// void TIM2_IRQHandler(void)
// {
//     if(TIM_GetITStatus(TIM2, TIM_IT_Update) == SET)
//     {
//         num++;
//         TIM_ClearITPendingBit(TIM2, TIM_IT_Update);
//     }
// } 