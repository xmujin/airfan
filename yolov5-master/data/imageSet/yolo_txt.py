# -*- coding: utf-8 -*-
import xml.etree.ElementTree as ET
import os
from os import getcwd

#将数据集分成几个模块 训练，测试，预测
sets = ['train', 'val', 'test']
# 种类，即：我所训练的几种手势
classes = ["ok","four","like","one","palm","peace","rock"]
abs_path = os.getcwd()
print(abs_path)


def convert(size, box):
    dw = 1. / (size[0])
    dh = 1. / (size[1])
    x = (box[0] + box[1]) / 2.0 - 1
    y = (box[2] + box[3]) / 2.0 - 1
    w = box[1] - box[0]
    h = box[3] - box[2]
    x = x * dw
    w = w * dw
    y = y * dh
    h = h * dh
    return x, y, w, h

def convert_annotation(image_id):
     in_file = open('E:\\StudyProject\\Projects\\fan\\yolov5-master\\data\\Annotations\\val\\%s.xml' %(image_id), encoding='UTF-8')  # 改成自己数据存放的地址
     out_file = open('E:\\StudyProject\\Projects\\fan\\yolov5-master\\data\\labels\\val\\%s.txt' %(image_id), 'w')  # 同上
     tree = ET.parse(in_file)
     root = tree.getroot()
     size = root.find('size')
     # 宽，高
     w = int(size.find('width').text)
     h = int(size.find('height').text)
     for obj in root.iter('object'):
        difficult = obj.find('difficult').text
        cls = obj.find('name').text
        if cls not in classes or int(difficult) == 1:
            continue
        cls_id = classes.index(cls)
        xmlbox = obj.find('bndbox')
        b = (float(xmlbox.find('xmin').text), float(xmlbox.find('xmax').text), float(xmlbox.find('ymin').text),
             float(xmlbox.find('ymax').text))
        # 变量b1到b4就分别存储了边界框的左上角和右下角的坐标，用于后续处理
        b1, b2, b3, b4 = b
        # 标注越界修正
        if b2 > w:
            b2 = w
        if b4 > h:
            b4 = h
        b = (b1, b2, b3, b4)
        bb = convert((w, h), b)
        out_file.write(str(cls_id) + " " + " ".join([str(a) for a in bb]) + '\n')
wd = getcwd()
#保存的路径
for image_set in sets:
    if not os.path.exists('E:\\StudyProject\\Projects\\fan\\yolov5-master\\data\\labels\\val'):  # 同上
        os.makedirs('E:\\StudyProject\\Projects\\fan\\yolov5-master\\data\\labels\\val')  # 同上
    image_ids = open('E:\\StudyProject\\Projects\\fan\\yolov5-master\\data\\imageSet\\Main\\%s.txt' % (image_set)).read().strip().split()  # 同上
    list_file = open('E:\\StudyProject\\Projects\\fan\\yolov5-master\\data\\%s.txt' % (image_set), 'w')  # 同上
    for image_id in image_ids:
        list_file.write(abs_path + 'E:\\StudyProject\\Projects\\fan\\yolov5-master\\data\\images\\val\\%s.jpg\n' % (image_id))  # 同上
        convert_annotation(image_id)
    list_file.close()