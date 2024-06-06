#ifndef __DHT11_H
#define __DHT11_H



typedef struct {
    uint8_t temperature;
    uint8_t humidity;
} DHT11_detect;

void DHT11_init(void);
DHT11_detect DHT11_Read(void);




#endif

