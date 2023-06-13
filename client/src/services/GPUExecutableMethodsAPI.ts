export const GPUMathMethods = {
  lib: `
    fn add(a: f32, b: f32) -> f32 {
      return a + b;
    }
    fn sub(a: f32, b: f32) -> f32 {
      return a - b;
    }
    fn mul(a: f32, b: f32) -> f32 {
      return a * b;
    }
    fn div(a: f32, b: f32) -> f32 {
      return a / b;
    }
    fn sqrt(a: f32) -> f32 {
      return sqrt(a);
    }
    fn api_sin(a: f32) -> f32 {
      return sin(a);
    }
    fn api_cos(a: f32) -> f32 {
      return cos(a);
    }
    fn len(arr: array<f32>) -> u32 {
      return arrayLength(&arr);
    }
    fn forEach(arr: array<f32>, cb: ptr<function, f32>) -> f32 {
      var i: u32 = 0;
      var result: f32 = 0;
      var userMethod = *cb;
      for (i = 0; i < arrayLength(&arr); i++) {
        result += userMethod(arr[i], f32(i));
      }
      return result;
    }
    fn map(arr: array<f32>, cb: ptr<function, f32>) -> array<f32> {
      var i: u32 = 0;
      //var result: array<f32> = new array<f32>(arrayLength(&arr));
      var result: array<f32>;
      var userMethod = *cb;
      for (i = 0; i < arrayLength(&arr); i++) {
        result[i] = userMethod(arr[i], f32(i));
      }
      return result;
    }
    fun sum(arr: array<f32>) -> f32 {
      var i: u32 = 0;
      var result: f32 = 0;
      for (i = 0; i < arrayLength(&arr); i++) {
        result += arr[i];
      }
      return result;
    }
    fn average(arr: array<f32>) -> f32 {
      var i: u32 = 0;
      var result: f32 = 0;
      for (i = 0; i < arrayLength(&arr); i++) {
        result += arr[i];
      }
      return result / f32(arrayLength(&arr));
    }
    fn variance(arr: array<f32>) -> f32 {
      var i: u32 = 0;
      var result: f32 = 0;
      var avg: f32 = average(arr);
      for (i = 0; i < arrayLength(&arr); i++) {
        result += (arr[i] - avg) * (arr[i] - avg);
      }
      return result / f32(arrayLength(&arr));
    }
  `,

  f32: {
    add(a: number, b: number) {
      return `add(${a}: f32, ${b}: f23)`;
    },
    sub(a: number, b: number) {
      return `sub(${a}: f32, ${b}: f23)`;
    },
    mul(a: number, b: number) {
      return `mul(${a}: f32, ${b}: f23)`;
    },
    div(a: number, b: number) {
      return `div(${a}: f32, ${b}: f23)`;
    },
    sqrt(a: number) {
      return `sqrt(${a}: f32)`;
    },
    sin(a: number) {
      return `api_sin(${a}: f32)`;
    },
    cos(a: number) {
      return `api_cos(${a}: f32)`;
    },
    log(a: number) {
      return `log(${a}: f32)`;
    },
    log2(a: number) {
      return `log2(${a}: f32)`;
    },
    logOf(base: number, a: number) {
      return `(log2(${a})/log2(${base}))`;
    },
    // forEach(array: number[], namedCBFunction: (n: number, index: number) => void) {
    //   return `forEach(array, &${namedCBFunction.name})`
    // },
    // map(array: number[], namedCBFunction: (n: number, index: number) => void) {
    //   return `map(array, &${namedCBFunction.name})`
    // }
    // average(array: number[]) {
    //   return `average(array)`;
    // },
    // variance(array: number[]) {
    //   return `variance(array)`;
    // },
    forEach(arrayVariableName: string, nameofCBFunction: string) {
      return `forEach(${arrayVariableName}, &${nameofCBFunction})`;
    },
    sum(arrayVariableName: string) {
      return `sum(${arrayVariableName})`;
    },
    map(arrayVariableName: string, nameofCBFunction: string) {
      return `map(${arrayVariableName}, &${nameofCBFunction})`;
    },
    average(arrayVariableName: string) {
      return `average(${arrayVariableName})`;
    },
    variance(arrayVariableName: string) {
      return `variance(${arrayVariableName})`;
    }
  },
};
