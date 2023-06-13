struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) uv: vec2<f32>,
};

struct Uniform {
  model_matrix: mat4x4<f32>,
  view_matrix: mat4x4<f32>,
  projection_matrix: mat4x4<f32>,
  normal_matrix: mat3x3<f32>,
  resolution: vec2<f32>,
  elapsedTime: f32, // in seconds
};

@group(0) @binding(0)
var<uniform> unif: Uniform;

fn forEach(arr: array<f32>, cb: ptr<function, f32>) -> f32 {
  var i: u32 = 0;
  var result: f32 = 0;
  var userMethod = *cb;
  for (i = 0; i < arrayLength(&arr); i++) {

	result += userMethod(arr[i], f32(i));
  }
  return result;
}

fn add(a: f32, b: f32) -> f32 {
  return a + b;
}
  

@vertex
fn vs_main(
  @location(0) position: vec3<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) uv: vec2<f32>,
) -> VertexOutput {
  var out: VertexOutput;
  out.position = unif.projection_matrix * unif.view_matrix * unif.model_matrix * vec4<f32>(position, 1.0);
  out.normal = normalize(unif.normal_matrix * normal);
  out.uv = uv;
  
  var test_arr: array<f32>;
  test_arr[0] = 1; test_arr[1] = 2; test_arr[2] = 3; test_arr[3] = 4; test_arr[4] = 5; test_arr[5] = 6;
  
  var val = forEach(test_arr, &add);
  
  out.position = vec3<f32>(val, 0, val);
  return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  return vec4<f32>(in.uv, pow(cos(unif.elapsedTime), 2.0), 1.0);
}