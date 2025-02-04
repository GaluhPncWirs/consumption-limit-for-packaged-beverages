import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest){
    const {pathname} = request.nextUrl
    const filledForm = request.cookies.get("formFilledSuccess")?.value === "true"

    // const refers = request.headers.get('referer')
    // const isRefresh = request.headers.get('sec-fetch-mode') === 'navigate'
    // console.log("ini untuk refresh", isRefresh)
    // console.log("ini untuk refers", refers)
    // if(!refers || !isRefresh){
    //     return NextResponse.redirect(new URL('/', request.url))
    // }

    if(!filledForm && pathname !== '/'){
        return NextResponse.redirect(new URL('/', request.url))
    }

    if(filledForm && pathname === '/'){
        return NextResponse.redirect(new URL('/mainContent', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher : ['/mainContent']
}