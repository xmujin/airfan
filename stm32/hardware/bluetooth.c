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

    // 使能USART1
    USART_Cmd(USART1, ENABLE);    

}


void sendByte(uint8_t byte)
{
    USART_SendData(USART1, byte);
    while(USART_GetFlagStatus(USART1, USART_FLAG_TXE) == RESET); // 等待发送寄存器为空
}


void sendArray(uint8_t *array, uint16_t length)
{
    uint16_t i;
    for(i = 0; i < length; i++)
    {
        sendByte(array[i]);
    }
}

