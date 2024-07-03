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
#include "pwm.h"

/**
 * @brief 
 * @return 使用PA7，TIM3，通过调整CCR来输出不同占空比的PWM波形
 * @author xiangbo (xx806181859@gmail.com)
 * @date 2024-05-30 23:05:53 
 */
void pwm_init(void)
{

    RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM3, ENABLE); // 使能TIM3时钟
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE); // 使用PA7作为PWM输出
    GPIO_InitTypeDef gpio_is;
    gpio_is.GPIO_Mode = GPIO_Mode_AF_PP; // 复用推挽输出，复用为TIM功能
    gpio_is.GPIO_Pin = GPIO_Pin_7;
    gpio_is.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_Init(GPIOA, &gpio_is);

    // PWM的频率= 时钟频率/分频倍数/ARR        即  100KHz / 100 = 1KHz
    TIM_TimeBaseInitTypeDef tbis;
    tbis.TIM_ClockDivision = TIM_CKD_DIV1;
    tbis.TIM_CounterMode = TIM_CounterMode_Up;
    tbis.TIM_Period = 100 - 1; // ARR
    tbis.TIM_Prescaler = 720 - 1;   // 720倍分频    即  72MHz / 720 =  100kHz =实际时钟频率
    tbis.TIM_RepetitionCounter = 0;
    TIM_TimeBaseInit(TIM3, &tbis);

    TIM_OCInitTypeDef tim_ocis;
    TIM_OCStructInit(&tim_ocis);
    tim_ocis.TIM_OCMode = TIM_OCMode_PWM1; // 比较模式
    tim_ocis.TIM_OCPolarity = TIM_OCPolarity_High; // 不反转
    tim_ocis.TIM_OutputState = TIM_OutputState_Enable; // 输出使能

    tim_ocis.TIM_Pulse = 0; // CCR

    TIM_OC2Init(TIM3, &tim_ocis);


    TIM_Cmd(TIM3, ENABLE);


}

/**
 * @brief 占空比 = CCR / ARR + 1, 假设ARR为99， CCR的值即为百分比
 * @param compare 占空比比例
 * @author xiangbo (xx806181859@gmail.com)
 * @date 2024-05-30
 */
void pwm_setCompare2(uint16_t compare)
{
    TIM_SetCompare2(TIM3, compare);
}


