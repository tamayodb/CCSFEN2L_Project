"use client"
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();

  const cartItems = [
    { id: "679e277ac4de6188e9e446da", qty: 1 },
    { id: "679e277ac4de6188e9e446de", qty: 1 },
    { id: "679e277ac4de6188e9e446e3", qty: 1 },
  ];

  const handleProceedToPayment = () => {
    const encodedData = encodeURIComponent(JSON.stringify(cartItems));
    router.push(`/sample2?cart=${encodedData}`);
  };

  return (
    <button onClick={handleProceedToPayment} className="bg-blue-500 text-white px-4 py-2 rounded">
      Proceed to Payment
    </button>
  );
}
