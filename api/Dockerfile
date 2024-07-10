FROM python:3.12

RUN apt-get update && \
    apt-get clean

# set working directory
WORKDIR /src

# add and install requirements
COPY ./requirements.txt /src/api/requirements.txt
RUN pip install -r /src/api/requirements.txt

# add flask api
COPY . /src/api

ENV FLASK_ENV development
ENV FLASK_RUN_PORT 5328
EXPOSE 5328

# run flask server
#CMD ["python3", "-m", "flask", "--app", "api.backend.index", "--debug", "run", "-p", "5328"]
CMD ["python3", "-m", "flask", "--app", "srcapi.backend.index", "run", "--host=0.0.0.0", "--port=5328"]