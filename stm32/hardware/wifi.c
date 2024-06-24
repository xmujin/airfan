/**
 * @file wifi.c
 * @author xiangbo (xx806181859@gmail.com)
 * @brief 
 * @version 1.0
 * @date 2024-06-20 10:06:19 
 * 
 * @copyright Copyright (c) 2024
 * 
 */



#include "stm32f10x.h"
#include "wifi.h"
#include<string.h>

uint8_t wifi_rxPacket[1024]; //接收数据包
uint8_t wifi_rxFlag = 0;

/**
 * @brief wifi的初始化，使用PA2(tx), PA3(rx)
 * @author xiangbo (xx806181859@gmail.com)
 * @date 2024-06-20 10:06:94 
 */
void wifi_init(void)
{
    // 初始化USART1
    USART_InitTypeDef USART_InitStructure;
    GPIO_InitTypeDef GPIO_InitStructure;

    // 使能GPIOA时钟
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);
    // 使能USART2时钟
    RCC_APB1PeriphClockCmd(RCC_APB1Periph_USART2, ENABLE);

    // 配置PA2为USART2 TX
    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_2;
    GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AF_PP; //复用推挽输出
    GPIO_Init(GPIOA, &GPIO_InitStructure);

    // 配置PA3为USART2 RX
    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_3;
    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IN_FLOATING;  // 浮空输入
    GPIO_Init(GPIOA, &GPIO_InitStructure);

    // USART参数配置
    USART_InitStructure.USART_BaudRate = 9600;
    USART_InitStructure.USART_WordLength = USART_WordLength_8b; // 8个数据位
    USART_InitStructure.USART_StopBits = USART_StopBits_1; // 1个停止位
    USART_InitStructure.USART_Parity = USART_Parity_No;
    USART_InitStructure.USART_HardwareFlowControl = USART_HardwareFlowControl_None;
    USART_InitStructure.USART_Mode = USART_Mode_Tx | USART_Mode_Rx;
    USART_Init(USART2, &USART_InitStructure);



    USART_ITConfig(USART2, USART_IT_RXNE, ENABLE);
    NVIC_PriorityGroupConfig(NVIC_PriorityGroup_2);
    NVIC_InitTypeDef ni;
    ni.NVIC_IRQChannel = USART2_IRQn;
    ni.NVIC_IRQChannelCmd = ENABLE;
    ni.NVIC_IRQChannelPreemptionPriority = 0;
    ni.NVIC_IRQChannelSubPriority = 0;
    NVIC_Init(&ni);


    // 使能USART2
    USART_Cmd(USART2, ENABLE);    

}





void wifi_sendByte(uint8_t byte)
{
    USART_SendData(USART1, byte); // 发送数据到蓝牙串口
    while(USART_GetFlagStatus(USART1, USART_FLAG_TXE) == RESET); // 等待发送寄存器为空
}

void wifi_sendJson(uint8_t *array)
{
    uint16_t i = 0;
    while(array[i] != '\0')
    {
        wifi_sendByte(array[i++]);
    }
}

void wifi_clearRxPacket(uint8_t *array)
{
    memset(array, 0, 1024);
}





void USART2_IRQHandler(void)
{
    static uint8_t rxState = 0;
    static uint16_t rxIndex = 0;
    if(USART_GetITStatus(USART2, USART_IT_RXNE) == SET)
    {
        uint8_t rxData = USART_ReceiveData(USART2);
        if(rxState == 0)
        {
            if(rxData == 0xFF) // 包开始
            {
                rxState = 1;
                rxIndex = 0;
            }
        }
        else if(rxState == 1)
        {
            
            if(rxData != 0xFE) //包结束
            {
                wifi_rxPacket[rxIndex++] = rxData;
            }
            else 
            {
                wifi_rxPacket[rxIndex++] = '\0';
                rxState = 0;
                wifi_sendJson(rxPacket);
            }
        }
    }
}

