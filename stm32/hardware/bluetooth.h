#ifndef __BLUETOOTH_H
#define __BLUETOOTH_H




void bluetooth_init(void);
void sendByte(uint8_t byte);
void sendArray(uint8_t *array, uint16_t length);
#endif

