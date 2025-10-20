import { Button } from "@/components/ui/button"

export default function Home(){
    return (
        <div className="relative w-full h-screen px-16 py-6 lg:px-28 lg:py-12 flex justify-center items-center ">
      <div className="w-full flex flex-col items-center space-y-6 lg:space-y-8 ">
        <section className="flex flex-col items-center space-y-4 text-center lg:text-start">
          <h1 className="text-4xl lg:text-6xl font-semibold text-slate-500">
            Welcome to <span className="text-blue-500">Link</span><span className="underline decoration-blue-500">Up</span>
          </h1>
          <p className="text-base lg:text-lg font-medium text-slate-500">
            Here you can talk with random people
          </p>
        </section>
        <section>
          <Button
            onClick={() => {
             alert("Cool")
            }}
            className="text-base font-semibold px-8 py-3 capitalize cursor-pointer"
          >
            Join LinkUp
          </Button>
        </section>
      </div>
    </div>
  )
}