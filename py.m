clc;
clear;
close all;
%USAR EM FICHEIROS CSV COM CABEÇALHO
%Leitura do Ficheiro
filename = 'dados_3.csv';
Dados = readtable(filename);
lin = size(Dados,1);
col = size(Dados,2);
Z = zeros(lin,1);
Np = 16384;

yr =Dados.(2);
yl =Dados.(4); 

%Criação de novos dados, normalizados e com a subtração da média


yrm = mean(yr);
ylm = mean(yl);


yrs = std(yr);
yls = std(yl);



yr_yrm = yr - yrm;
yr_norm = yr_yrm / yrs;


yl_ylm = yl - ylm;
yl_norm = yl_ylm / yls;


sumy = yr_norm + yl_norm; // ESTÁ TUDO CERTO NO JS ATÉ AQUI!


yr = sgolayfilt(yr_norm, 0, 53);
yl = sgolayfilt(yl_norm, 0, 53);
sumy = sgolayfilt(sumy, 0, 53);


%FFT Y
fm = Np/lin;

f =(-(Np)/2:(Np)/2-1)/(30*fm);

A= detrend(sumy);
Y = fft(A,Np);
Y0 = fftshift(Y);


[~,loc] = maxk(Y0,2);
FREQ = f(loc);
FREQ12 = abs(FREQ);
med = mean(FREQ12);
n = 2;
while med <=  0.1
    n = n+2;
    [~,loc] = maxk(Y0,n);
    FREQ = f(loc);
    FREQ2 = abs(FREQ(1, n-1 : n));
    med = mean(FREQ2);
end
    
RPMY = med*60;    

format short, RPMY