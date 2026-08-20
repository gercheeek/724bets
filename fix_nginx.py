import os

def fix():
    conf_path = '/etc/nginx/sites-available/default'
    with open(conf_path, 'r') as f:
        conf = f.read()

    if 'location /socket.io/' not in conf:
        block = """
    location /socket.io/ {
        proxy_pass http://127.0.0.1:3001/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
"""
        conf = conf.replace('location / {', block + '    location / {')
        with open(conf_path, 'w') as f:
            f.write(conf)
            
    # Clean up .rej
    enabled_dir = '/etc/nginx/sites-enabled/'
    for f in os.listdir(enabled_dir):
        if f.endswith('.rej'):
            os.remove(os.path.join(enabled_dir, f))
            
if __name__ == '__main__':
    fix()
