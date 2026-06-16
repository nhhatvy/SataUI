'use client'

import React from 'react'
import Link from 'next/link'
import { Logo } from '@/shared/components/logo'
import {
  Sparkles,
  ArrowRight,
  Cpu,
  Code,
  Award,
  LineChart,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  GraduationCap
} from 'lucide-react'
import { cn } from '@/shared/utils/utils'

export default function LandingPage() {
  const stats = [
    { value: '5000+', label: 'Học sinh tham gia' },
    { value: '150+', label: 'Giảng viên chuyên môn' },
    { value: '98%', label: 'Phụ huynh hài lòng' },
    { value: '30+', label: 'Bản đồ Robot thông minh' }
  ]

  const courses = [
    {
      title: 'Lập trình Robot cơ bản',
      desc: 'Giúp trẻ làm quen với các mô hình vật lý, cảm biến siêu âm, học cách điều khiển robot di chuyển và tránh vật cản.',
      level: 'Lớp 3 - Lớp 5',
      duration: '24 buổi',
      tag: 'Robotics',
      color: 'from-orange-500 to-amber-500',
      icon: Cpu
    },
    {
      title: 'Sáng tạo Scratch',
      desc: 'Làm quen với tư duy lập trình kéo thả trực quan qua các dự án trò chơi phiêu lưu, vẽ tranh và hoạt hình tương tác sinh động.',
      level: 'Lớp 1 - Lớp 3',
      duration: '16 buổi',
      tag: 'Scratch',
      color: 'from-indigo-500 to-blue-500',
      icon: Code
    },
    {
      title: 'Tư duy thuật toán & Cơ khí lắp ráp',
      desc: 'Đi sâu hơn vào cấu trúc dữ liệu cơ bản, vòng lặp phức tạp kết hợp nguyên lý cơ học bánh răng và tay đòn chịu lực.',
      level: 'Lớp 4 - Lớp 7',
      duration: '32 buổi',
      tag: 'Thuật toán',
      color: 'from-emerald-500 to-teal-500',
      icon: GraduationCap
    }
  ]

  const benefits = [
    {
      title: 'Học qua dự án (Project-based Learning)',
      desc: 'Các bài học lý thuyết được tích hợp trực tiếp vào quá trình tự lắp ráp và viết code vận hành sản phẩm thực tế.',
      icon: Cpu
    },
    {
      title: 'Hệ thống gamification kích thích tư duy',
      desc: 'Học sinh nhận điểm XP thăng cấp, chuỗi ngày streak học tập và tích lũy SataCoin đổi quà thực tế tại shop phần thưởng.',
      icon: Award
    },
    {
      title: 'Cổng theo dõi toàn diện dành cho phụ huynh',
      desc: 'Báo cáo định kỳ tự động, tiến trình học tập thời gian thực, hình ảnh buổi học và kênh đóng góp phản hồi trực tiếp.',
      icon: LineChart
    }
  ]

  const testimonials = [
    {
      name: 'Chị Trần Thu Hương',
      role: 'Phụ huynh bé Bảo Minh',
      comment: 'Bảo Minh trước đây rất ham chơi game, nhưng từ khi học Robotics ở SataRobo, con chuyển sang say mê tự lắp ráp mô hình và tự viết code điều khiển xe tránh vật cản. Cực kỳ khuyên các bố mẹ đăng ký!'
    },
    {
      name: 'Anh Nguyễn Minh Quang',
      role: 'Phụ huynh bé Thảo An',
      comment: 'Tôi rất ấn tượng với Cổng phụ huynh. Hàng tuần tôi đều nhận được PDF báo cáo chi tiết con yếu phần nào, ảnh con cười đùa trong giờ lắp ráp và lịch học rõ ràng để dễ sắp xếp nghỉ phép.'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-orange-500 selection:text-white">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-18 items-center justify-between px-6">
          <Logo />

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-300">
            <a href="#courses" className="hover:text-primary transition-colors">Khóa học</a>
            <a href="#benefits" className="hover:text-primary transition-colors">Lợi ích</a>
            <a href="#testimonials" className="hover:text-primary transition-colors">Đánh giá</a>
            <a href="#contact" className="hover:text-primary transition-colors">Liên hệ</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-orange-500 hover:bg-orange-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-orange-500/10 transition-all active:scale-95 cursor-pointer"
            >
              Vào Demo
              <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-36">
        {/* Glow Effects */}
        <div className="absolute left-1/4 top-1/4 -z-10 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[100px]" />
        <div className="absolute right-1/4 bottom-1/4 -z-10 size-[500px] translate-x-1/2 translate-y-1/2 rounded-full bg-indigo-500/10 blur-[100px]" />

        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/5 px-4 py-1.5 text-sm font-bold text-orange-400">
              <Sparkles className="size-3.5" />
              Công nghệ giáo dục STEM chuẩn quốc tế
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-6xl text-white leading-[1.1]">
              Khơi dậy tư duy sáng tạo cùng <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">SataRobo</span>
            </h1>

            <p className="text-lg leading-relaxed text-slate-400 max-w-2xl">
              Nền tảng đào tạo lập trình trực quan, lắp ráp robot thông minh giúp trẻ từ 6 - 15 tuổi phát triển tư duy logic và khoa học máy tính thông qua trải nghiệm thực hành sinh động.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-2xl bg-orange-500 hover:bg-orange-600 px-8 py-4 text-base font-black text-white shadow-xl shadow-orange-500/20 transition-all active:scale-95 cursor-pointer"
              >
                Khám phá ngay
                <ArrowRight className="ml-2 size-5" />
              </Link>
              <a
                href="#courses"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 px-8 py-4 text-base font-bold text-slate-300 transition-colors cursor-pointer"
              >
                Xem khóa học
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] rounded-3xl border border-slate-800 bg-slate-950/50 p-4 shadow-2xl backdrop-blur-3xl overflow-hidden flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-transparent to-indigo-500/10 opacity-60" />
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-rose-500" />
                  <span className="size-3 rounded-full bg-amber-500" />
                  <span className="size-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-xs text-slate-500 font-bold tracking-widest uppercase">SATAROBO SYSTEM</span>
              </div>
              <div className="flex-1 flex flex-col justify-center items-center py-6 text-center">
                <span className="text-5xl mb-4">🤖</span>
                <h3 className="text-base font-bold text-slate-900 text-white">Cổng kết nối Phụ huynh & Học sinh</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-xs leading-relaxed">
                  Báo cáo trực quan cho phụ huynh. Bài giảng video sinh động tích lũy phần thưởng cho con.
                </p>
              </div>
              <div className="flex gap-2 text-sm font-black">
                <Link href="/login" className="flex-1 text-center py-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-white transition-all cursor-pointer">
                  Cổng Phụ huynh
                </Link>
                <Link href="/login" className="flex-1 text-center py-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all cursor-pointer">
                  Cổng Học sinh
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-slate-900 bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-white">{stat.value}</div>
              <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-sm font-black tracking-widest text-primary uppercase">Chương trình đào tạo</h2>
          <h3 className="text-3xl font-black sm:text-4xl text-white">Khóa học robotics & tư duy thuật toán</h3>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            Các lớp học được chia theo độ tuổi và năng lực để đảm bảo lộ trình tiếp thu tự nhiên, hứng thú và đạt chất lượng tốt nhất.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {courses.map((course, idx) => {
            const Icon = course.icon
            return (
              <div key={idx} className="group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/30 p-6 transition-all hover:border-slate-700 hover:bg-slate-900/60 shadow-xl">
                <div>
                  <div className={cn("inline-flex p-3 rounded-2xl bg-gradient-to-r text-white mb-6", course.color)}>
                    <Icon className="size-6" />
                  </div>
                  <span className="block text-sm font-bold text-slate-400">{course.tag}</span>
                  <h4 className="text-base font-bold text-slate-900 text-white mt-2 leading-tight">{course.title}</h4>
                  <p className="text-sm text-slate-400 mt-3 leading-relaxed">{course.desc}</p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-800/80 flex items-center justify-between text-sm text-slate-300">
                  <span><strong>Độ tuổi:</strong> {course.level}</span>
                  <span><strong>Thời lượng:</strong> {course.duration}</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 bg-slate-900/20 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid gap-16 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-sm font-black tracking-widest text-primary uppercase">Tại sao chọn SataRobo?</h2>
            <h3 className="text-3xl font-black text-white leading-tight">Phương pháp giáo dục tiên tiến kiến tạo tương lai</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Chúng tôi không chỉ dạy trẻ lập trình. SataRobo giúp trẻ rèn luyện khả năng chia nhỏ vấn đề, cải thiện tính kiên nhẫn và khám phá giải pháp sáng tạo qua từng sản phẩm hoàn thiện.
            </p>
            <div className="pt-2">
              <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-orange-400 transition-colors cursor-pointer">
                Đăng ký trải nghiệm lớp học thử miễn phí
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid gap-6">
            {benefits.map((b, idx) => {
              const Icon = b.icon
              return (
                <div key={idx} className="flex gap-4 p-5 rounded-2xl border border-slate-800 bg-slate-900/30">
                  <span className="grid size-11 place-items-center rounded-xl bg-orange-500/10 text-orange-400 shrink-0">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h4 className="text-sm font-black text-white">{b.title}</h4>
                    <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-sm font-black tracking-widest text-primary uppercase font-bold">Ý kiến khách hàng</h2>
          <h3 className="text-3xl font-black sm:text-4xl text-white">Chia sẻ chân thực từ các phụ huynh</h3>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {testimonials.map((t, idx) => (
            <div key={idx} className="relative p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/20 flex flex-col justify-between gap-6">
              <span className="absolute right-6 top-6 text-6xl text-slate-800 pointer-events-none select-none">“</span>
              <p className="text-sm text-slate-300 leading-relaxed italic relative z-10">
                "{t.comment}"
              </p>
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary font-black text-sm">
                  {t.name.split(' ').pop()?.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <h4 className="text-sm font-black text-white">{t.name}</h4>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 p-8 sm:p-12 text-center text-white overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent pointer-events-none" />
          <h3 className="text-3xl sm:text-5xl font-black tracking-tight leading-none text-white">
            Sẵn sàng đồng hành cùng sự phát triển của con?
          </h3>
          <p className="mt-4 text-sm sm:text-base text-white/90 max-w-2xl mx-auto leading-relaxed">
            Đăng nhập vào cổng thông tin giả lập để trực tiếp trải nghiệm cách SataRobo quản lý lớp học, lập báo cáo tuần/tháng tự động cho phụ huynh và tạo động lực học tập cho học sinh.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-2xl bg-white hover:bg-slate-50 px-8 py-4 text-base font-black text-orange-600 transition-all shadow-xl hover:shadow-white/10 active:scale-95 cursor-pointer"
            >
              Vào trải nghiệm Demo ngay
              <ArrowRight className="ml-2 size-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 text-white">Thông tin liên hệ</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Bạn có câu hỏi hoặc cần tư vấn thêm về chương trình học? Vui lòng liên hệ với ban tuyển sinh SataRobo qua các cổng thông tin chính thức dưới đây.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Phone className="size-4.5 text-primary" />
                <span>Hotline: 1900 8686</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Mail className="size-4.5 text-primary" />
                <span>Email: tuyensinh@satarobo.edu.vn</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <MapPin className="size-4.5 text-primary" />
                <span>Cơ sở 1: Tầng 3, Lab Lab Building, Cầu Giấy, Hà Nội</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/20">
            <h4 className="text-sm font-black text-white mb-4">Gửi tin nhắn nhanh</h4>
            <form onSubmit={(e) => { e.preventDefault(); alert('Cảm ơn bạn đã gửi liên hệ! Chúng tôi sẽ phản hồi sớm nhất.') }} className="space-y-3">
              <input type="text" placeholder="Họ và tên phụ huynh" required className="w-full text-sm rounded-xl border border-slate-800 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-primary focus:outline-none animate-none" />
              <input type="email" placeholder="Địa chỉ Email" required className="w-full text-sm rounded-xl border border-slate-800 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-primary focus:outline-none animate-none" />
              <textarea placeholder="Nội dung cần hỗ trợ..." rows={3} required className="w-full text-sm rounded-xl border border-slate-800 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-primary focus:outline-none animate-none" />
              <button type="submit" className="w-full py-3 rounded-xl bg-orange-500 text-sm font-black text-white hover:bg-orange-600 cursor-pointer">Gửi thông tin</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 bg-slate-950 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Học Viện Công Nghệ SataRobo. Bảo lưu mọi quyền.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Điều khoản</a>
            <a href="#" className="hover:underline">Bảo mật</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
