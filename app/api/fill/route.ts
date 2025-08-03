// app/api/fill/route.ts
let fills: any[] = [];
export async function POST(req: Request) {
  fills.unshift(await req.json());
  fills = fills.slice(0, 20); // keep last 20
  return new Response("ok");
}
export async function GET() {
  return Response.json(fills);
}
