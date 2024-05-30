/**
 * @file pwm.c
 * @author xiangbo (xx806181859@gmail.com)
 * @brief PWM脉冲宽度调制函数的实现
 * @version 1.0
 * @date 2024-05-30 23:05:57 
 * 
 * @copyright Copyright (c) 2024
 * 
 */
#include "stm32f10x.h"

/**
 * @brief 
 * @return int 
 * @author xiangbo (xx806181859@gmail.com)
 * @date 2024-05-30 23:05:53 
 */
void pwm_init(void)
{
    RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM2, ENABLE); // 使能时钟

    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);
    GPIO_InitTypeDef gpio_is;
    gpio_is.GPIO_Mode = GPIO_Mode_AF_PP; // 复用推挽输出
    gpio_is.GPIO_Pin = GPIO_Pin_1;
    gpio_is.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_Init(GPIOA, &gpio_is);


    TIM_TimeBaseInitTypeDef tbis;
    tbis.TIM_ClockDivision = TIM_CKD_DIV1;
    tbis.TIM_CounterMode = TIM_CounterMode_Up;
    tbis.TIM_Period = 100 - 1; // ARR
    tbis.TIM_Prescaler = 720 - 1;  // 72MHZ / 7200 / 10000   PSC
    tbis.TIM_RepetitionCounter = 0;
    TIM_TimeBaseInit(TIM2, &tbis);

    TIM_OCInitTypeDef tim_ocis;
    TIM_OCStructInit(&tim_ocis);
    tim_ocis.TIM_OCMode = TIM_OCMode_PWM1; // 比较模式
    tim_ocis.TIM_OCPolarity = TIM_OCPolarity_High; // 不反转
    tim_ocis.TIM_OutputState = TIM_OutputState_Enable; // 输出使能

    tim_ocis.TIM_Pulse = 0; // CCR

    TIM_OC2Init(TIM2, &tim_ocis);


    TIM_Cmd(TIM2, ENABLE);




}

/**
 * @brief 
 * @param compare 
 * @author xiangbo (xx806181859@gmail.com)
 * @date 2024-05-30
 */
void pwm_setCompare2(uint16_t compare)
{
    TIM_SetCompare2(TIM2, compare);
}


