import {PythonShell} from 'python-shell';

function getPythonVarType(pyCode: string, callback: (type: string) => void) {
  const options = {
    scriptPath: '/path/to/python/script/',
    args: [pyCode]
  };

  PythonShell.run('get_var_type.py', options);
}