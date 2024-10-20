FROM python:3.14-rc-slim
RUN pip install redis
COPY ./worker.py /worker.py
COPY ./rediswq.py /rediswq.py

CMD  python worker.py
