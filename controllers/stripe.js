import stripe from "stripe";
import User from "../model/User.js";
import Subscription from "../model/Subscription.js";

export const stripe_pay = async (req, res) => {
  try {
    const stripe_key = process.env.STRIPE_PRIVATE_KEY;
    const stripeInstance = new stripe(stripe_key);

    const { email, plan } = req.body;

    const product = await stripeInstance.products.create({
      name: plan.name,
      description: plan.price + " / " + plan.type,
    });
    const price = await stripeInstance.prices.create({
      unit_amount: parseInt(plan.price) * 100,
      currency: "inr",
      recurring: {
        interval: plan.type,
      },
      product: product.id,
    });
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: "https://richpanel-subscription.vercel.app//success",
      cancel_url: "https://richpanel-subscription.vercel.app//cancel",
    });
    const user = await User.findOne({ email: email });
    const newSubscription = new Subscription({
      user_id: user._id,
      date: new Date(),
      status: true,
      session_id: session.id,
      billing_cycle: plan.type,
      plan_name: plan.name,
      plan_id: plan.id,
      plan_price: plan.price,
    });
    const savedSubscription = await newSubscription.save();
    res.json({ url: session.url, subscription: savedSubscription });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
