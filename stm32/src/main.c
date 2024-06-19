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
#define LED_PERIPH RCC_APB2Periph_GPIOA
#define LED_PORT GPIOA
#define LED_PIN GPIO_Pin_1




uint16_t i;
//uint16_t num = 0;
int main()
{
    led_init(GPIOB, GPIO_Pin_5);
    led_close(GPIOB, GPIO_Pin_5);
    //led_open(GPIOB, GPIO_Pin_5);
    OLED_Init();
    bluetooth_init();
    //timer_init();
    OLED_ShowString(1, 1, "nazzzsm is:");

    
    
    //OLED_ShowString(2, 1, "shabi");
    //pwm_init();                



    // RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);
    // GPIO_InitTypeDef gpio_is;
    // gpio_is.GPIO_Mode = GPIO_Mode_Out_PP; // 复用推挽输出
    // gpio_is.GPIO_Pin = GPIO_Pin_6;
    // gpio_is.GPIO_Speed = GPIO_Speed_50MHz;
    // GPIO_Init(GPIOA, &gpio_is);
    // GPIO_WriteBit(GPIOA, GPIO_Pin_6, Bit_SET);

    //uint8_t sb[] = "AT+NAME=xiangxun\r\n";
    //sendArray(sb, sizeof(sb));
    
    
    //OLED_Clear();
    uint8_t a = 0;
    while (1)
    {
        if(a == 51)
        {
            led_open(GPIOB, GPIO_Pin_5);
            Delay_ms(300);
            led_close(GPIOB, GPIO_Pin_5);
            Delay_ms(300);
        }

        if(USART_GetFlagStatus(USART1, USART_FLAG_RXNE) == SET)
        {
            a = USART_ReceiveData(USART1);
            if(a == 49)  // ascii 字符1
            {
                led_open(GPIOB, GPIO_Pin_5);
            }

            if(a == 50) // ascii 字符2
            {
                led_close(GPIOB, GPIO_Pin_5);
            }
            OLED_ShowNum(2, 1, a, 3);
        }
        //sendByte(1);


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

// void TIM2_IRQHandler(void)
// {
//     if(TIM_GetITStatus(TIM2, TIM_IT_Update) == SET)
//     {
//         num++;
//         TIM_ClearITPendingBit(TIM2, TIM_IT_Update);
//     }
// } 