import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv("heart.csv")
# print(df.head())

#Kiểm tra dữ liệu thiếu
for i in df:
    if df[i].isnull().sum()>0:
        print(f'{i} has:  {df[i].isnull().sum()} missing values')
    else:
        print(f'{i} has:  {df[i].isnull().sum()} missing values')

print(df.describe())
print(df.info())
print(df.shape)


# Vẽ biểu đồ phân phối tuổi theo tình trạng bệnh tim
plt.figure(figsize=(10,6))
sns.histplot(
    data=df,
    x='age',
    hue='target',
    bins=15,
    kde=True
)

plt.title('Phân phối tuổi theo tình trạng bệnh tim')
plt.xlabel('Age')
plt.ylabel('Count')
plt.show()

# Vẽ biểu đồ phân phối giới tính theo tình trạng bệnh tim
plt.figure(figsize=(6,4))

sns.countplot(
    data=df,
    x='sex',
    hue='target'
)

plt.title('Giới tính và tỷ lệ mắc bệnh tim')
plt.xlabel('Sex (0=Nữ,1=Nam)')
plt.ylabel('Count')

plt.show()

# Vẽ biểu đồ phân phối mức độ cholesterol theo tình trạng bệnh tim
plt.figure(figsize=(12,8))

sns.heatmap(
    df.corr(),
    annot=True,
    cmap='coolwarm'
)

plt.title('Correlation Matrix')
plt.show()

#Báo cáo thống kê về tuổi trung bình của bệnh nhân mắc bệnh tim và không mắc bệnh tim
mean_age_with_heart_disease = df[df['target'] == 1]['age'].mean()
mean_age_without_heart_disease = df[df['target'] == 0]['age'].mean()
print(f'Tuổi trung bình của bệnh nhân mắc bệnh tim: {mean_age_with_heart_disease:.2f} tuổi')
print(f'Tuổi trung bình của bệnh nhân không mắc bệnh tim: {mean_age_without_heart_disease:.2f} tuổi')

#Báo cáo thống kê về tỷ lệ mắc bệnh tim theo giới tính
heart_disease_by_sex = df.groupby('sex')['target'].mean()
print(f'Tỷ lệ mắc bệnh tim theo giới tính:')
for sex, rate in heart_disease_by_sex.items():
    print(f'  Giới tính {sex}: {rate:.2%}')

#Báo cáo thống kê về mức độ cholesterol trung bình của bệnh nhân mắc bệnh tim và không mắc bệnh tim
mean_chol_with_heart_disease = df[df['target'] == 1]['chol'].mean()
mean_chol_without_heart_disease = df[df['target'] == 0]['chol'].mean()
print(f'Mức độ cholesterol trung bình của bệnh nhân mắc bệnh tim: {mean_chol_with_heart_disease:.2f} mg/dl')
print(f'Mức độ cholesterol trung bình của bệnh nhân không mắc bệnh tim: {mean_chol_without_heart_disease:.2f} mg/dl')



#Chuẩn hóa dữ liệu
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()

numeric_features = ['age', 'trestbps', 'chol', 'thalach', 'oldpeak']
df[numeric_features] = scaler.fit_transform(df[numeric_features])

#Xuất dữ liệu đã chuẩn hóa
df.to_csv("Clean_Data.csv", index=False)

