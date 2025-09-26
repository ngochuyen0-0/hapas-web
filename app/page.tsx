"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
// @ts-ignore
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Cửa Hàng Túi Xách Hapas
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl"
          >
            Những chiếc túi xách thanh lịch được chế tác dành cho người phụ nữ hiện đại. Khám phá bộ sưu tập phụ kiện thủ công cao cấp của chúng tôi.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="https://expo.dev" target="_blank">Tải Ứng Dụng Di Động</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Bộ Sưu Tập Cao Cấp</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Khám phá những chiếc túi xách được thiết kế thủ công với phong cách, sự thoải mái và độ bền vượt trội.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Chất Liệu Cao Cấp",
              description: "Được chế tác từ da thật cao cấp và vật liệu bền vững để đảm bảo chất lượng lâu dài.",
              icon: "👜"
            },
            {
              title: "Thủ Công Tinh Tế",
              description: "Mỗi sản phẩm được chế tác thủ công tỉ mỉ bởi các nghệ nhân có tay nghề cao.",
              icon: "🧵"
            },
            {
              title: "Thiết Kế Vĩnh Điển",
              description: "Thiết kế thanh lịch vượt qua mọi mùa và xu hướng thời trang.",
              icon: "✨"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Product Showcase */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-card rounded-xl border p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">Khám Phá Bộ Sưu Tập</h2>
              <p className="text-muted-foreground mb-6">
                Trải nghiệm mua sắm tuyệt vời với ứng dụng di động của chúng tôi. 
                Duyệt qua các sản phẩm, xem chi tiết, thêm vào giỏ hàng và thanh toán dễ dàng.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Duyệt sản phẩm và tìm kiếm",
                  "Xem chi tiết sản phẩm",
                  "Quản lý giỏ hàng",
                  "Theo dõi đơn hàng",
                  "Lịch sử mua hàng"
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-primary mr-2">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Button asChild>
                <Link href="https://expo.dev" target="_blank">Tải Ứng Dụng Ngay</Link>
              </Button>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-muted border rounded-lg p-4 w-full max-w-md">
                <div className="bg-background border rounded p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                  <div className="flex space-x-2 pt-4">
                    <div className="h-8 bg-primary rounded w-24"></div>
                    <div className="h-8 bg-secondary rounded w-24"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Sẵn Sàng Mua Sắm?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Tham gia cộng đồng những khách hàng yêu thích thời trang hoặc khám phá bộ sưu tập túi xách tuyệt vời của chúng tôi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="lg">
              <Link href="https://expo.dev" target="_blank">Tải Ứng Dụng Ngay</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Cửa Hàng Túi Xách Hapas. Tất cả các quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
}