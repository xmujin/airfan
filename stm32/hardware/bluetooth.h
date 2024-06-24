#ifndef __BLUETOOTH_H
#define __BLUETOOTH_H


extern uint8_t blue_rxPacket[1024]; //接收数据包
extern uint8_t blue_rxFlag;


void bluetooth_init(void);
void blue_sendByte(uint8_t byte);

void blue_sendString(char *array);
void blue_sendJson(uint8_t *array);
void blue_clearRxPacket(uint8_t *array);



#endif

