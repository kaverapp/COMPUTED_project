//this is an wrapper where we dont have to add try and catch  block for all the blck

const asyncHandler=(requestHandler)=>{                 //highr order function
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((err)=>next(err));
    }
};



export {asyncHandler};

// const asyncHandler=(fn)=>async(req,res,next)=>{
//     try {
//         await fn(req,res,next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }