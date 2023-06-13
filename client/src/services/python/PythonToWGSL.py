class PythonToWGSL:
    def __init__(self, pythonCode):
        self.pythonCode = pythonCode
        self.wgslCode = self.convertToWGSL()

    def convertToWGSL(self):
        return self.pythonCode
        