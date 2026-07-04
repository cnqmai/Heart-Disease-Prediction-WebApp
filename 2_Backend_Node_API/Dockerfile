FROM node:20-bookworm-slim

ENV NODE_ENV=production
ENV PYTHONUNBUFFERED=1
ENV PYTHON_CMD=python3

WORKDIR /app/2_Backend_Node_API

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 python3-pip \
    && rm -rf /var/lib/apt/lists/*

COPY 2_Backend_Flask_API/requirements.txt /tmp/python-requirements.txt
RUN pip3 install --break-system-packages --no-cache-dir -r /tmp/python-requirements.txt

COPY 2_Backend_Node_API/package*.json ./
RUN npm install --omit=dev

COPY 2_Backend_Node_API/ .
COPY 1_Machine_Learning/ /app/1_Machine_Learning/

EXPOSE 5000

CMD ["npm", "start"]
