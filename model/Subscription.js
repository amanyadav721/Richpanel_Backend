import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
    {
        user_id : {
            type : String,
            require : true,
        },
        date : {
            type : Date,
            require : true,
        },
        status : {
            type : Boolean,
            require : true,
        },
        session_id : {
            type : String,
            require : true,
        },
        billing_cycle : {
            type : String,
            require : true,
        },
        plan_name : {
            type : String,
            require : true,
        },
        plan_id : {
            type : String,
            require : true,
        },
        plan_price : {
            type : Number,
            require : true,
        }
    },
    { timestamps : true },
);

const Subscription = mongoose.model("Subscription",SubscriptionSchema);
export default Subscription;