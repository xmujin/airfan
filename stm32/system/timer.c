#include "stm32f10x.h"



void timer_init(void)
{
    RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM2, ENABLE); // 使能时钟
    TIM_TimeBaseInitTypeDef tbis;
    tbis.TIM_ClockDivision = TIM_CKD_DIV1;
    tbis.TIM_CounterMode = TIM_CounterMode_Up;
    tbis.TIM_Period = 10000 - 1;
    tbis.TIM_Prescaler = 7200 - 1;  // 72MHZ / 7200 / 10000
    tbis.TIM_RepetitionCounter = 0;
    TIM_TimeBaseInit(TIM2, &tbis);
    TIM_ITConfig(TIM2, TIM_IT_Update, ENABLE); // 使能更新中断
    NVIC_PriorityGroupConfig(NVIC_PriorityGroup_2);
    NVIC_InitTypeDef nvic_is;
    nvic_is.NVIC_IRQChannel = TIM2_IRQn;
    nvic_is.NVIC_IRQChannelCmd = ENABLE;
    nvic_is.NVIC_IRQChannelPreemptionPriority = 2;
    nvic_is.NVIC_IRQChannelSubPriority = 1;
    NVIC_Init(&nvic_is);
    TIM_Cmd(TIM2, ENABLE);


}


/* void TIM2_IRQHandler(void)
{
    if(TIM_GetITStatus(TIM2, TIM_IT_Update) == SET)
    {
        TIM_ClearITPendingBit(TIM2, TIM_IT_Update);
    }
} */
