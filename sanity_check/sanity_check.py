import pandas as pd
import errno
import os


if __name__ == '__main__':
    file_path = 'data/pad_ufes_20.csv'
    images_base_dir = 'data/imgs/'

    data = pd.read_csv(file_path)   

    print('----- Looking for missing data on biopsed patients ------ \n')
    for index, row in data.iterrows():
        if row['biopsed']:
            if row.isnull().values.any():
                raise Exception("Found null value on entry " + str(index))
    print(16 * ' ' + 'No missing data')
    print('--------------------------------------------------------- \n')

    print('----- Looking for missing data on non biopsed patients ------ \n')
    non_biopsed_data = data[
            ['patient_id', 'lesion_id', 'age', 'region', 'diagnostic', 'itch', 'grew', 'hurt', 'changed', 'bleed',
                'elevation', 'img_path', 'biopsed']]
    for index, row in non_biopsed_data.iterrows():
        if not row['biopsed']:
            if row.isnull().values.any():
                raise Exception("Found null value on entry " + str(index))
    print(16 * ' ' + 'No missing data')
    print('------------------------------------------------------------ \n')

    print('----- Checking images path -----\n')
    imgs_path = data['img_path']
    for path in imgs_path:
        if not (os.path.exists(images_base_dir + path)):
            raise FileNotFoundError(errno.ENOENT, os.strerror(errno.ENOENT), path)

    print(8*' ' + 'Images Check - OK')
    print('-------------------------------- \n')

    print('----- Checking lesions diagnostics ----\n')
    diags_list = ['NEV', 'SEK', 'ACK', 'BCC', 'BOW', 'SCC', 'MEL']
    diagnostics = data['diagnostic']
    for _diagnostic in diagnostics:
        if _diagnostic not in diags_list:
            raise Exception(_diagnostic + " isn't a known diagnostic")
    print(8 * ' ' + 'Lesions diagnostic - OK ')
    print('--------------------------------------- \n')

    print('----- Checking lesions region ----\n')
    region_list = ['CHEST', 'BACK', 'ABDOMEN', 'FACE', 'THIGH', 'FOREARM', 'HAND', 'SCALP', 'ARM', 'NECK', 'EAR', 'FOOT', 'LIP', 'NOSE']
    regions = data['region']
    for _region in regions:
        if _region not in region_list:
            raise Exception(_region + " isn't a known region")
    print(8 * ' ' + 'Lesions region - OK ')
    print('---------------------------------- \n')

    print('----- Checking patients age ----\n')
    patients_age = data['age']
    if not all(age <= 120 for age in patients_age):
        raise Exception('Patient born before 1900, is that correct?')
    else:
        print(8*' ' + 'Patients Age - OK ')
        print('-------------------------------- \n')

    print('----- Checking lesions diameter ----')
    lesion_d1_check = data[['diameter_1', 'biopsed']]
    for index, row in lesion_d1_check.iterrows():
        if row['biopsed']:
            if (row['diameter_1'] > 300):
                raise Exception("Lesion bigger than 150mm, is that correct?")
    print('      Lesions Diamter 1 - OK ')

    lesion_d2_check = data[['diameter_2', 'biopsed']]
    for index, row in lesion_d2_check.iterrows():
        if row['biopsed']:
            if (row['diameter_2'] > 300):
                raise Exception("Lesion bigger than 150mm, is that correct?")

    print('      Lesions Diameter 2 - OK ')
    print('------------------------------------ \n')

    print('----- Checking lesions fitspatrick value ----')
    ftp_check = data[['fitspatrick', 'biopsed']]
    for index, row in ftp_check.iterrows():
        if row['biopsed']:
            if (row['fitspatrick'] > 6):
                raise Exception("Lesion Fitspatrick value greater than 5, is that correct?")

    print(8 * ' ' + 'Fitspatrick value - OK ')
    print('---------------------------------------------\n')
