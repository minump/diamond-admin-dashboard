from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from diamond.wrapper.wrapper import register_container

app = FastAPI()

class Container(BaseModel):
    base_image: str
    image_file_name: str
    endpoint: str
    work_path: str

@app.post('/api/register_container')
async def register_container_api(container: Container):
    try:
        register_container(endpoint_id=container.endpoint, work_path=container.work_path, base_image=container.base_image, image_file_name=container.image_file_name)
        return {"message": "Container registered successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5328)