#ifndef __LED_H
#define __LED_H


void led_init(GPIO_TypeDef *GPIOx, uint16_t GPIO_Pin);
void led_open(GPIO_TypeDef *GPIOx, uint16_t GPIO_Pin);
void led_close(GPIO_TypeDef *GPIOx, uint16_t GPIO_Pin);
#endif

