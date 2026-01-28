export async function onRequestPost({ request, env }) {
try {
    const data = await request.json();
    const { title, price } = data;

    const preference = {
    items: [
        {
        title,
        quantity: 1,
        currency_id: "ARS",
        unit_price: Number(price)
        }
    ],
    back_urls: {
        success: "https://TU_DOMINIO/success.html",
        pending: "https://TU_DOMINIO/pending.html",
        failure: "https://TU_DOMINIO/failure.html"
    },
    auto_return: "approved"
    };

    const response = await fetch(
    "https://api.mercadopago.com/checkout/preferences",
    {
        method: "POST",
        headers: {
        "Authorization": `Bearer ${env.MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
        },
        body: JSON.stringify(preference)
    }
    );

    const result = await response.json();

    return new Response(
    JSON.stringify({ init_point: result.init_point }),
    { headers: { "Content-Type": "application/json" } }
    );

} catch (err) {
    return new Response(
    JSON.stringify({ error: "Error creando preferencia" }),
    { status: 500 }
    );
}
}

back_urls: {
    success: "https://example.com/success",
    failure: "https://example.com/failure",
    pending: "https://example.com/pending"
}