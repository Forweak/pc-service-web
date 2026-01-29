export async function onRequestPost({ request, env }) {
try {
    const data = await request.json();

    const response = await fetch(
    "https://api.mercadopago.com/checkout/preferences",
    {
        method: "POST",
        headers: {
        Authorization: `Bearer ${env.MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
        items: [
            {
            title: data.title,
            quantity: 1,
            currency_id: "ARS",
            unit_price: Number(data.price)
            }
        ],
        back_urls: {
            success: "https://pc-service-web.pages.dev/success.html",
            failure: "https://pc-service-web.pages.dev/failure.html",
            pending: "https://pc-service-web.pages.dev/pending.html"
        },
        auto_return: "approved"
        })
    }
    );

    const preference = await response.json();

    return new Response(
    JSON.stringify({
        init_point: preference.init_point,
        sandbox_init_point: preference.sandbox_init_point
    }),
    { headers: { "Content-Type": "application/json" } }
    );

} catch (error) {
    return new Response(
    JSON.stringify({ error: "Error creando preferencia" }),
    { status: 500 }
    );
}
}

console.log('Respuesta MP:', preference); 