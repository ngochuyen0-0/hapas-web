import { PrismaClient } from '../lib/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Bắt đầu tạo dữ liệu mẫu...')
  
  // Tạo người dùng quản trị
  const adminPasswords = [
    await bcrypt.hash('admin123', 10),
    await bcrypt.hash('manager123', 10),
    await bcrypt.hash('staff123', 10)
  ]
  
  const admins = await prisma.admin.createMany({
    data: [
      {
        email: 'admin@hapas.com',
        password_hash: adminPasswords[0],
        full_name: 'Quản Trị Viên',
        role: 'super_admin'
      },
      {
        email: 'manager@hapas.com',
        password_hash: adminPasswords[1],
        full_name: 'Quản Lý',
        role: 'manager'
      },
      {
        email: 'staff@hapas.com',
        password_hash: adminPasswords[2],
        full_name: 'Nhân Viên',
        role: 'staff'
      }
    ],
    skipDuplicates: true
  })
  console.log(`Đã tạo ${admins.count} người dùng quản trị`)
  
  // Tạo danh mục chi tiết với nhiều thông tin hơn
  const categories = await prisma.category.createMany({
    data: [
      {
        name: 'Túi Xách Công Sở',
        description: 'Những chiếc túi xách thanh lịch phù hợp cho môi trường công sở chuyên nghiệp. Thiết kế tinh tế, chất liệu cao cấp, nhiều ngăn tiện ích giúp bạn tổ chức đồ dùng một cách gọn gàng và chuyên nghiệp.',
        is_active: true
      },
      {
        name: 'Túi Xách Thời Trang',
        description: 'Túi xách thiết kế thời trang cho các dịp đi chơi, dạo phố. Với nhiều kiểu dáng và màu sắc đa dạng, các sản phẩm này sẽ giúp bạn nổi bật và thể hiện phong cách cá nhân.',
        is_active: true
      },
      {
        name: 'Ba Lô',
        description: 'Ba lô thời trang và tiện dụng cho công việc và du lịch. Với thiết kế ergonomic, đệm lưng thoáng khí và nhiều ngăn chứa, ba lô của chúng tôi là lựa chọn lý tưởng cho sinh viên, nhân viên văn phòng và những người yêu thích du lịch.',
        is_active: true
      },
      {
        name: 'Ví',
        description: 'Các loại ví da cao cấp cho nam và nữ. Từ ví cầm tay sang trọng đến ví dài cá tính, tất cả đều được làm từ chất liệu da thật hoặc da cao cấp, đảm bảo độ bền và tính thẩm mỹ cao.',
        is_active: true
      },
      {
        name: 'Túi Đeo Chéo',
        description: 'Túi đeo chéo nhỏ gọn, tiện lợi cho các hoạt động hàng ngày. Thiết kế trẻ trung, năng động với nhiều ngăn chứa phù hợp để mang theo điện thoại, ví, chìa khóa và các vật dụng cá nhân khác.',
        is_active: true
      },
      {
        name: 'Vali Du Lịch',
        description: 'Vali chất lượng cao cho các chuyến du lịch dài ngày. Với chất liệu bền bỉ, bánh xe xoay 360 độ mượt mà và tay kéo chắc chắn, vali của chúng tôi sẽ đồng hành cùng bạn trong mọi hành trình.',
        is_active: true
      },
      {
        name: 'Túi Tote',
        description: 'Túi tote rộng rãi, phù hợp để mang theo nhiều vật dụng. Với thiết kế đơn giản nhưng tinh tế, túi tote là lựa chọn hoàn hảo cho việc đi chợ, đi làm hoặc đi chơi cuối tuần.',
        is_active: true
      },
      {
        name: 'Phụ Kiện',
        description: 'Những phụ kiện thời trang cao cấp để bổ sung cho phong cách của bạn. Từ khăn lụa mềm mại đến móc khóa độc đáo, mỗi phụ kiện đều được thiết kế tỉ mỉ để tôn vinh vẻ đẹp của bạn.',
        is_active: true
      },
      {
        name: 'Túi Đựng Laptop',
        description: 'Túi đựng laptop chuyên dụng với ngăn đệm bảo vệ thiết bị công nghệ. Thiết kế hiện đại với nhiều ngăn phụ để tổ chức các phụ kiện như sạc, chuột, tài liệu một cách gọn gàng.',
        is_active: true
      },
      {
        name: 'Túi Du Lịch',
        description: 'Túi du lịch đa năng với nhiều kích thước phù hợp cho các chuyến đi ngắn hoặc dài ngày. Chất liệu chống thấm nước, khóa kéo bền bỉ và nhiều ngăn chứa giúp bạn sắp xếp hành lý một cách hiệu quả.',
        is_active: true
      }
    ],
    skipDuplicates: true
  })
  console.log(`Đã tạo ${categories.count} danh mục`)
  
  // Lấy danh sách danh mục đã tạo
  const categoryList = await prisma.category.findMany()
  
  // Tạo sản phẩm chi tiết với nhiều thông tin hơn
  const productsData = [
    // Túi Xách Công Sở
    {
      name: 'Túi Xách Da Thật Cổ Điển Sang Trọng',
      description: 'Chiếc túi xách da thật cao cấp với thiết kế cổ điển, hoàn hảo cho công việc văn phòng. Được làm từ da bò thật 100%, bên trong có nhiều ngăn tiện lợi bao gồm ngăn laptop riêng biệt, ngăn điện thoại, ngăn thẻ và ngăn chính rộng rãi. Khóa kéo cao cấp, quai đeo có thể điều chỉnh độ dài và tay cầm chắc chắn tạo nên sự tiện nghi và sang trọng.',
      price: 199.99,
      category_id: categoryList[0].id,
      brand: 'Hapas Luxury',
      material: 'Da Bò Thật Ý 100%',
      color: 'Đen Bóng',
      size: '32x26x14 cm',
      is_active: true
    },
    {
      name: 'Túi Xách Da Pu Sang Trọng Cao Cấp',
      description: 'Túi xách với thiết kế hiện đại, phù hợp cho cả công sở và các dịp đặc biệt. Chất liệu da PU cao cấp, bền đẹp theo thời gian với khả năng chống thấm nước tốt. Thiết kế tối giản với các đường nét tinh tế, khóa nam châm tiện lợi và tay cầm mềm mại. Bên trong có ngăn laptop 15 inch và nhiều ngăn phụ để tổ chức đồ dùng.',
      price: 149.99,
      category_id: categoryList[0].id,
      brand: 'Hapas Executive',
      material: 'Da PU Cao Cấp',
      color: 'Nâu Socola',
      size: '30x24x12 cm',
      is_active: true
    },
    {
      name: 'Túi Xách Da Lộn Thời Trang Năng Động',
      description: 'Túi xách da lộn với thiết kế trẻ trung, phù hợp cho các bạn trẻ năng động. Nhiều ngăn chứa tiện lợi và khóa kéo chắc chắn. Thiết kế hiện đại với các đường chỉ may tỉ mỉ, khóa kéo chống gỉ sét và quai đeo có thể tháo rời. Bên trong có ngăn laptop 13 inch, ngăn điện thoại và nhiều ngăn nhỏ để thẻ.',
      price: 129.99,
      category_id: categoryList[1].id,
      brand: 'Hapas Urban',
      material: 'Da Lộn Cao Cấp',
      color: 'Đỏ Tía Sẫm',
      size: '28x22x10 cm',
      is_active: true
    },
    {
      name: 'Túi Xách Da Cá Sấu Độc Đáo Sang Trọng',
      description: 'Túi xách với họa tiết da cá sấu độc đáo, mang lại vẻ sang trọng và đẳng cấp cho người sở hữu. Chất liệu da tổng hợp cao cấp với họa tiết da cá sấu 3D nổi bật. Thiết kế với khóa vàng hồng sang trọng, tay cầm da thật mềm mại và đáy túi có chân đệm chắc chắn. Bên trong có ngăn laptop 14 inch và nhiều ngăn phụ tiện ích.',
      price: 299.99,
      category_id: categoryList[1].id,
      brand: 'Hapas Exotic',
      material: 'Da Cá Sấu Nhân Tạo Cao Cấp',
      color: 'Đen Nhám',
      size: '35x28x16 cm',
      is_active: true
    },
    // Ba Lô
    {
      name: 'Ba Lô Laptop Chuyên Nghiệp Cao Cấp',
      description: 'Chiếc ba lô chuyên nghiệp với ngăn đệm laptop riêng biệt, phù hợp cho dân văn phòng và sinh viên. Chất liệu vải chống thấm nước cao cấp với lớp lót chống sốc cho laptop. Thiết kế ergonomic với đệm lưng thoáng khí, dây đeo có thể điều chỉnh và tay cầm trên đỉnh. Có nhiều ngăn chứa bao gồm ngăn chính rộng rãi, ngăn laptop 17 inch, ngăn phụ và ngăn phía trước tiện lợi.',
      price: 129.99,
      category_id: categoryList[2].id,
      brand: 'Hapas Professional',
      material: 'Vải Polyester Chống Thấm Cao Cấp',
      color: 'Xanh Navy Sang Trọng',
      size: '48x32x22 cm',
      is_active: true
    },
    {
      name: 'Ba Lô Du Lịch Nhỏ Gọn Tiện Lợi',
      description: 'Ba lô nhỏ gọn lý tưởng cho các chuyến đi ngắn ngày. Thiết kế gọn nhẹ với nhiều ngăn chứa tiện lợi. Chất liệu vải oxford bền bỉ với khả năng chống thấm nước tốt. Có ngăn chính rộng rãi, ngăn laptop 15 inch, ngăn phụ và ngăn phía trước. Dây đeo có đệm êm ái và tay cầm chắc chắn giúp mang vác thoải mái.',
      price: 89.99,
      category_id: categoryList[2].id,
      brand: 'Hapas Traveler',
      material: 'Vải Oxford 600D',
      color: 'Xám Than',
      size: '42x28x18 cm',
      is_active: true
    },
    // Ví
    {
      name: 'Ví Da Gấp Đôi Cao Cấp Sang Trọng',
      description: 'Chiếc ví gấp đôi cổ điển với nhiều ngăn thẻ và ngăn tiền. Được làm từ da bò thật mềm mại, bền đẹp theo thời gian. Thiết kế với 6 ngăn thẻ trong suốt, 2 ngăn tiền giấy rộng rãi và ngăn xu riêng biệt. Đường chỉ may tỉ mỉ, khóa kéo mượt mà và logo in chìm sang trọng. Kích thước vừa vặn cho nam và nữ.',
      price: 59.99,
      category_id: categoryList[3].id,
      brand: 'Hapas Classic',
      material: 'Da Bò Thật Ý',
      color: 'Nâu Socola Sang Trọng',
      size: '20x11x3.5 cm',
      is_active: true
    },
    {
      name: 'Ví Nam Dài Cá Tính Thời Trang',
      description: 'Ví nam dài với thiết kế sang trọng, nhiều ngăn chứa phù hợp cho các quý ông hiện đại. Chất liệu da pu cao cấp với khả năng chống thấm nước tốt. Thiết kế với 8 ngăn thẻ trong suốt, 2 ngăn tiền giấy rộng rãi, ngăn chứng minh thư riêng biệt và ngăn tiền xu. Đường chỉ may chắc chắn, khóa kéo bền bỉ và logo in nổi tinh tế.',
      price: 45.99,
      category_id: categoryList[3].id,
      brand: 'Hapas Executive',
      material: 'Da PU Cao Cấp',
      color: 'Đen Bóng',
      size: '22x12x2.5 cm',
      is_active: true
    },
    // Túi Đeo Chéo
    {
      name: 'Túi Đeo Chéo Mini Thời Trang Trẻ Trung',
      description: 'Túi đeo chéo mini nhỏ gọn, phù hợp cho các hoạt động hàng ngày như đi chơi, đi làm. Thiết kế trẻ trung, nhiều màu sắc lựa chọn. Chất liệu vải canvas bền bỉ với khả năng chống bám bụi tốt. Thiết kế với ngăn chính rộng rãi, ngăn điện thoại riêng biệt và ngăn khóa kéo phía trước. Dây đeo có thể điều chỉnh độ dài và khóa cài chắc chắn.',
      price: 39.99,
      category_id: categoryList[4].id,
      brand: 'Hapas Urban',
      material: 'Vải Canvas Cao Cấp',
      color: 'Hồng Pastel',
      size: '22x16x7 cm',
      is_active: true
    },
    {
      name: 'Túi Đeo Chéo Unisex Năng Động Phong Cách',
      description: 'Túi đeo chéo phong cách unisex phù hợp cho cả nam và nữ. Thiết kế đơn giản nhưng tinh tế. Chất liệu vải kaki bền bỉ với khả năng chống thấm nước nhẹ. Thiết kế với ngăn chính rộng rãi, ngăn điện thoại riêng biệt và ngăn phía trước. Dây đeo có đệm êm ái và khóa cài chắc chắn giúp mang vác thoải mái.',
      price: 49.99,
      category_id: categoryList[4].id,
      brand: 'Hapas Active',
      material: 'Vải Kaki Cao Cấp',
      color: 'Xanh Navy',
      size: '24x18x8 cm',
      is_active: true
    },
    // Vali Du Lịch
    {
      name: 'Vali Kéo Nhôm Cao Cấp Sang Trọng',
      description: 'Vali kéo nhôm cao cấp với độ bền vượt trội, khóa TSA tiêu chuẩn quốc tế. Bánh xe xoay 360 độ mượt mà. Chất liệu hợp kim nhôm cao cấp với khả năng chống va đập tốt. Thiết kế với nhiều ngăn chứa bao gồm ngăn chính rộng rãi, ngăn quần áo có dây buộc, ngăn phụ và ngăn phía trước. Tay kéo đa tầng chắc chắn và khóa TSA an toàn cho du lịch quốc tế.',
      price: 249.99,
      category_id: categoryList[5].id,
      brand: 'Hapas Premium',
      material: 'Hợp Kim Nhôm Cao Cấp',
      color: 'Bạc Sang Trọng',
      size: '75x50x28 cm',
      is_active: true
    },
    {
      name: 'Vali Kéo Nhựa PC Siêu Nhẹ Thời Trang',
      description: 'Vali nhựa PC siêu nhẹ với khả năng chống va đập tốt. Thiết kế thời trang với nhiều màu sắc lựa chọn. Chất liệu nhựa PC siêu nhẹ với khả năng chống va đập tốt và chịu nhiệt tốt. Thiết kế với nhiều ngăn chứa bao gồm ngăn chính rộng rãi, ngăn quần áo có dây buộc, ngăn phụ và ngăn phía trước. Bánh xe xoay 360 độ mượt mà và tay kéo nhôm chắc chắn.',
      price: 179.99,
      category_id: categoryList[5].id,
      brand: 'Hapas Lite',
      material: 'Nhựa PC Cao Cấp',
      color: 'Tím Lavender',
      size: '68x45x25 cm',
      is_active: true
    },
    // Túi Tote
    {
      name: 'Túi Tote Vải Cotton Thân Thiện Môi Trường',
      description: 'Túi tote làm từ vải cotton thân thiện với môi trường. Thiết kế rộng rãi, phù hợp để đi chợ, đi chơi hoặc đi làm. Chất liệu vải cotton 100% thân thiện với môi trường và da. Thiết kế với quai đeo rộng rãi giúp phân bố trọng lượng đều, ngăn chính rộng rãi và đáy túi có lớp lót chống rách. Có thể in ấn hoặc thêu theo yêu cầu.',
      price: 29.99,
      category_id: categoryList[6].id,
      brand: 'Hapas Eco',
      material: 'Vải Cotton 100% Hữu Cơ',
      color: 'Trắng Tinh Khiết',
      size: '42x38x16 cm',
      is_active: true
    },
    {
      name: 'Túi Tote Da Lộn Sang Trọng Cao Cấp',
      description: 'Túi tote sang trọng làm từ da lộn cao cấp. Thiết kế tối giản nhưng vẫn giữ được sự thời trang. Chất liệu da lộn cao cấp với khả năng chống thấm nước tốt. Thiết kế với quai đeo da thật mềm mại, ngăn chính rộng rãi và đáy túi có chân đệm chắc chắn. Có thể sử dụng như túi xách tay hoặc túi đeo vai.',
      price: 89.99,
      category_id: categoryList[6].id,
      brand: 'Hapas Luxe',
      material: 'Da Lộn Cao Cấp',
      color: 'Nâu Socola',
      size: '40x35x14 cm',
      is_active: true
    },
    // Phụ Kiện
    {
      name: 'Khăn Lụa Sang Trọng Tinh Tế',
      description: 'Chiếc khăn lụa sang trọng với họa tiết hoa tinh tế. Chất liệu lụa 100% mềm mại, mang lại vẻ đẹp quyến rũ cho người sở hữu. Chất liệu lụa 100% cao cấp với khả năng thấm hút tốt và không gây kích ứng da. Thiết kế với các họa tiết hoa tinh tế được in bằng công nghệ cao cấp. Có thể sử dụng như khăn choàng, khăn trang trí hoặc khăn gói quà.',
      price: 45.99,
      category_id: categoryList[7].id,
      brand: 'Hapas Silk',
      material: '100% Lụa Tự Nhiên',
      color: 'Đa Màu Hoa Văn',
      size: '72x72 cm',
      is_active: true
    },
    {
      name: 'Móc Khóa Thời Trang Độc Đáo',
      description: 'Bộ móc khóa thời trang với nhiều thiết kế độc đáo. Chất liệu hợp kim bền đẹp, chống gỉ sét. Chất liệu hợp kim cao cấp với khả năng chống gỉ sét và phai màu. Thiết kế với nhiều hình dạng độc đáo như trái tim, ngôi sao, hình học... Có thể sử dụng như móc khóa túi xách, móc khóa balo hoặc trang sức thời trang.',
      price: 15.99,
      category_id: categoryList[7].id,
      brand: 'Hapas Charm',
      material: 'Hợp Kim Cao Cấp Mạ Vàng Hồng',
      color: 'Vàng Hồng Sang Trọng',
      size: '6x4x1.5 cm',
      is_active: true
    },
    // Túi Đựng Laptop
    {
      name: 'Túi Đựng Laptop Chống Sốc Cao Cấp',
      description: 'Túi đựng laptop chuyên dụng với ngăn đệm bảo vệ thiết bị công nghệ. Thiết kế hiện đại với nhiều ngăn chứa. Chất liệu vải polyester chống thấm nước cao cấp với lớp lót chống sốc EVA dày dặn. Thiết kế với ngăn laptop 17 inch có đệm chống sốc, ngăn phụ cho sạc, chuột và tài liệu, ngăn điện thoại riêng biệt. Khóa kéo bền bỉ và tay cầm chắc chắn.',
      price: 59.99,
      category_id: categoryList[8].id,
      brand: 'Hapas Tech',
      material: 'Vải Polyester Chống Thấm + Lót EVA',
      color: 'Đen Carbon',
      size: '42x32x6 cm',
      is_active: true
    },
    // Túi Du Lịch
    {
      name: 'Túi Du Lịch Đa Năng Nhỏ Gọn',
      description: 'Túi du lịch đa năng với nhiều kích thước phù hợp cho các chuyến đi ngắn hoặc dài ngày. Thiết kế thông minh với nhiều ngăn chứa. Chất liệu vải oxford 600D bền bỉ với khả năng chống thấm nước tốt. Thiết kế với ngăn chính rộng rãi, ngăn quần áo có dây buộc, ngăn giày riêng biệt, ngăn phụ và ngăn phía trước. Có tay cầm chắc chắn và dây đeo vai tiện lợi.',
      price: 79.99,
      category_id: categoryList[9].id,
      brand: 'Hapas Journey',
      material: 'Vải Oxford 600D',
      color: 'Xanh Dương',
      size: '50x30x25 cm',
      is_active: true
    }
  ]
  
  const products = []
  for (const productData of productsData) {
    const product = await prisma.product.create({
      data: productData
    })
    products.push(product)
  }
  console.log(`Đã tạo ${products.length} sản phẩm`)
  
  // Tạo hàng tồn kho chi tiết cho từng sản phẩm với nhiều thông tin hơn
  const inventoryItems = []
  for (const product of products) {
    // Tạo nhiều mục tồn kho cho mỗi sản phẩm ở các vị trí khác nhau
    const locations = [
      'Kho Chính - Quận 1, TP. HCM',
      'Cửa Hàng - Quận 3, TP. HCM',
      'Kho Phụ - Quận Bình Thạnh, TP. HCM',
      'Cửa Hàng - Quận Phú Nhuận, TP. HCM',
      'Kho Miền Bắc - Hà Nội',
      'Kho Miền Trung - Đà Nẵng'
    ]
    
    // Tạo từ 1-3 mục tồn kho cho mỗi sản phẩm
    const numInventoryItems = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < numInventoryItems; i++) {
      const location = locations[Math.floor(Math.random() * locations.length)]
      
      const inventoryItem = await prisma.inventory.create({
        data: {
          product_id: product.id,
          quantity: Math.floor(Math.random() * 150) + 30, // Số lượng ngẫu nhiên từ 30-180
          reserved_quantity: Math.floor(Math.random() * 20), // Số lượng đã đặt ngẫu nhiên từ 0-20
          location: location
        }
      })
      inventoryItems.push(inventoryItem)
    }
  }
  console.log(`Đã tạo ${inventoryItems.length} mục hàng tồn kho`)
  
  // Tạo khách hàng mẫu với thông tin chi tiết hơn
  const customerPasswords = [
    await bcrypt.hash('customer123', 10),
    await bcrypt.hash('customer456', 10),
    await bcrypt.hash('customer789', 10),
    await bcrypt.hash('nguyenvana123', 10),
    await bcrypt.hash('tranthib234', 10)
  ]
  
  const customers = await prisma.customer.createMany({
    data: [
      {
        email: 'customer@hapas.com',
        password_hash: customerPasswords[0],
        full_name: 'Nguyễn Văn A',
        phone: '0901234567',
        address: '123 Đường ABC, Phường XYZ, Quận 1, TP. HCM'
      },
      {
        email: 'customer2@hapas.com',
        password_hash: customerPasswords[1],
        full_name: 'Trần Thị B',
        phone: '0907654321',
        address: '456 Đường DEF, Phường GHI, Quận 3, TP. HCM'
      },
      {
        email: 'customer3@hapas.com',
        password_hash: customerPasswords[2],
        full_name: 'Lê Văn C',
        phone: '0909876543',
        address: '789 Đường JKL, Phường MNO, Quận Bình Thạnh, TP. HCM'
      },
      {
        email: 'nguyenvana@gmail.com',
        password_hash: customerPasswords[3],
        full_name: 'Nguyễn Văn An',
        phone: '0912345678',
        address: '234 Đường Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. HCM'
      },
      {
        email: 'tranthib@gmail.com',
        password_hash: customerPasswords[4],
        full_name: 'Trần Thị Bình',
        phone: '0987654321',
        address: '567 Đường Lê Duẩn, Phường Hải Châu 1, Quận Hải Châu, Đà Nẵng'
      }
    ],
    skipDuplicates: true
  })
  console.log(`Đã tạo ${customers.count} khách hàng`)
  
  console.log('Hoàn thành tạo dữ liệu mẫu.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })