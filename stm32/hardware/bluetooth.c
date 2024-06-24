/**
 * @file bluetooth.c
 * @author xiangbo (xx806181859@gmail.com)
 * @brief 
 * @version 1.0
 * @date 2024-06-06 15:06:87 
 * 
 * @copyright Copyright (c) 2024
 * 
 */



#include "stm32f10x.h"
#include "OLED.h"
#include "bluetooth.h"
#include "cJSON.h"

uint8_t blue_rxPacket[1024]; //接收数据包
uint8_t blue_rxFlag = 0;

/**
 * @brief 初始化蓝牙, 打开串口1时钟和对应的TX  RX引脚
 * @author xiangbo (xx806181859@gmail.com)
 * @date 2024-06-06 15:06:72 
 */
void bluetooth_init(void)
{
    // 初始化USART1
    USART_InitTypeDef USART_InitStructure;
    GPIO_InitTypeDef GPIO_InitStructure;

    // 使能GPIOA时钟
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);
    // 使能USART1时钟
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_USART1, ENABLE);

    // 配置PA9为USART1 TX
    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_9;
    GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AF_PP; //复用推挽输出
    GPIO_Init(GPIOA, &GPIO_InitStructure);

    // 配置PA10为USART1 RX
    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_10;
    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IN_FLOATING;  // 浮空输入
    GPIO_Init(GPIOA, &GPIO_InitStructure);

    // USART参数配置
    USART_InitStructure.USART_BaudRate = 9600;
    USART_InitStructure.USART_WordLength = USART_WordLength_8b; // 8个数据位
    USART_InitStructure.USART_StopBits = USART_StopBits_1; // 1个停止位
    USART_InitStructure.USART_Parity = USART_Parity_No;
    USART_InitStructure.USART_HardwareFlowControl = USART_HardwareFlowControl_None;
    USART_InitStructure.USART_Mode = USART_Mode_Tx | USART_Mode_Rx;
    USART_Init(USART1, &USART_InitStructure);

    USART_ITConfig(USART1, USART_IT_RXNE, ENABLE);
    NVIC_PriorityGroupConfig(NVIC_PriorityGroup_2);
    NVIC_InitTypeDef ni;
    ni.NVIC_IRQChannel = USART1_IRQn;
    ni.NVIC_IRQChannelCmd = ENABLE;
    ni.NVIC_IRQChannelPreemptionPriority = 0;
    ni.NVIC_IRQChannelSubPriority = 0;
    NVIC_Init(&ni);



    // 使能USART1
    USART_Cmd(USART1, ENABLE);    

}


void blue_sendByte(uint8_t byte)
{
    USART_SendData(USART2, byte); // 向串口2发送数据
    while(USART_GetFlagStatus(USART2, USART_FLAG_TXE) == RESET); // 等待发送寄存器为空
}


void blue_sendJson(uint8_t *array)
{
    uint16_t i = 0;
    while(array[i] != '\0')
    {
        blue_sendByte(array[i++]);
    }
}

void blue_sendString(char *array)
{
    uint16_t i = 0;
    while(array[i] != '\0')
    {
        blue_sendByte(array[i]);
        i++;
    }
}

void blue_clearRxPacket(uint8_t *array)
{
    memset(array, 0, 1024);
}









/**
 * @brief 用于蓝牙串口的接收中断
 * @author xiangbo (xx806181859@gmail.com)
 * @date 2024-06-24 09:06:94 
 */
void USART1_IRQHandler(void)
{
    static uint8_t rxState = 0;
    static uint16_t rxIndex = 0;
    
    if(USART_GetITStatus(USART1, USART_IT_RXNE) == SET)
    {
        uint8_t rxData = USART_ReceiveData(USART1);
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
                blue_rxPacket[rxIndex++] = rxData;
            }
            else // 获取json数据结束
            {
                rxState = 0;
                blue_rxFlag = 1;
                OLED_ShowNum(1,1,33,3);
            }
        }
    }
}
