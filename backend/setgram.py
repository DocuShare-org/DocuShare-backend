from gingerit.gingerit import GingerIt

# './../util.txt'
with open('./../util.txt', 'r') as file:
    data = file.read().replace('\n', '')

# text = 'I love write becauss it give me pleasure'
# text = 'I love write becauss it give me pleasure'

parser = GingerIt()
res = parser.parse(data)

print(res['result'])

with open('./../util.txt', "w") as f:
    f.write(res['result'])

# Hqw can my check my grammar online? Checks you gammar onine usin Grammarly's Gramar Chck Tol. If you need a tool that will help correct your writing instantaneously as you write, you can install Grammarly for your desktop or browser extension.