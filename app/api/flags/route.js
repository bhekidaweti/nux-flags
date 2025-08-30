import flags from '../../data/flags.json';

export async function GET() {
    return Response.json(flags);
}