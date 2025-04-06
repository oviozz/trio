
import TryOnPage from "@/app/try-on/[productID]/_components/try-on-page";

type TryOutLayoutProps = {
    params: Promise<{
        productID: string
    }>
}

export default async function TryOutPage({ params }: TryOutLayoutProps){

    const { productID } = await params;

    return (
        <TryOnPage productID={productID} />
    )

}