from __future__ import annotations

FloatArray = list[float]

def main():
    """Main"""
    array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    result = DMAC(array)

    print(result)



def DMAC(array: FloatArray) -> FloatArray:
    """DMAC (Double Moving Average Crossover)"""
    short = 10
    long = 20
    short_ma = SMA(array, short)
    long_ma = SMA(array, long)
    return crossover(short_ma, long_ma)

def SMA(array: FloatArray, period: int) -> FloatArray:
    """Simple Moving Average"""
    # return [sum(array[i-period:i]) / period for i in range(period, len(array))]
    result = [] #   10      100
    for i in range(period, len(array)):
        sum = 0
        #               10 - 10 = 0, 10
        #               11 - 10 = 1, 11
        for j in range(i-period, i):
            sum += array[j]
        result.append(sum / period)

def crossover(array1: FloatArray, array2: FloatArray) -> FloatArray:
    """Crossover"""
    return [1 if array1[i] > array2[i] else -1 for i in range(len(array1))]


def sum(array: FloatArray) -> float:
    """Sum"""
    return reduce(lambda x, y: x + y, array)

def api_map(func, array: FloatArray) -> FloatArray:
    """Map"""
    return [func(x) for x in array]

def average(array: FloatArray) -> float:
    """Average"""
    return sum(array) / len(array)

def reduce(func, array: FloatArray) -> float:
    """Reduce"""
    return func(array)

def variance(array: FloatArray) -> float:
    """Variance"""
    return average(api_map(lambda x: (x - average(array)) ** 2, array))



def __add__(self, other):
    if isinstance(other, float) or isinstance(other, int):
        real_part = self.real + other
        imag_part = self.imag

    if isinstance(other, CustomComplex):
        real_part = self.real + other.real
        imag_part = self.imag + other.imag

    return self.__class__(real_part, imag_part)