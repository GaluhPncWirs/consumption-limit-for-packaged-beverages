import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest){
    const {pathname} = request.nextUrl
    const filledForm = request.cookies.get("formFilledSuccess")?.value === "true"

    if(pathname.startsWith("/admin")){
        if(pathname === "/admin/login"){
            return NextResponse.next()
        }
        const isLoginAdmin = request.cookies.get("isLogin")?.value === "true"
        if(!isLoginAdmin){
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
        return NextResponse.next()
    }

    if(!filledForm && pathname !== '/'){
        return NextResponse.redirect(new URL('/', request.url))
    }

    if(filledForm && pathname === '/'){
        return NextResponse.redirect(new URL('/mainContent', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher : ['/mainContent/:path*', '/admin/:path*']
}