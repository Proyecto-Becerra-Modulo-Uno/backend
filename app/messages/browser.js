export const success = (req, res, status=200, message="")=>{
    res.status(status).json({
        error:false,
        status:status,
        body:message
    })
}

export const error = (req, res, status=500, message="")=>{
    res.status(status).json({
        error:true,
        status:status,
        body:message
    })
}