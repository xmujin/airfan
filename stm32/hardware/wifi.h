#ifndef __WIFI_H
#define __WIFI_H

extern uint8_t wifi_rxPacket[1024]; //接收数据包
extern uint8_t wifi_rxFlag;

void wifi_init(void);
void wifi_sendByte(uint8_t byte);
void wifi_sendJson(uint8_t *array);
void wifi_clearRxPacket(uint8_t *array);
#endif

