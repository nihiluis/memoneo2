from whispercpp import Whisper

w = Whisper.from_pretrained("tiny.en")
result = w.transcribe_from_file("./examples_english.wav")
print(result)
