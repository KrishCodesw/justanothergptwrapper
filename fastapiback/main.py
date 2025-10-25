from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/item/{id}")
async def read_params(id:int):
    return {"message-":id}