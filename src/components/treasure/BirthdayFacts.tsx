import React from 'react';
import { ArrowLeft, Star, Moon, Calendar, Sparkles, Heart, Users } from 'lucide-react';

interface BirthdayFactsProps {
  onBack: () => void;
}

const BirthdayFacts: React.FC<BirthdayFactsProps> = ({ onBack }) => {
  const birthDate = new Date(2006, 11, 14);
  const dayOfWeek = birthDate.toLocaleDateString('de-CH', { weekday: 'long' });

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all mb-8 group"
        >
          <span>Wiiter zum nöchste Schritt</span>
          <ArrowLeft className="group-hover:translate-x-1 transition-transform rotate-180" size={20} />
        </button>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Din besondere Tag ✨
          </h1>
          <p className="text-2xl text-gray-600">
            14. Dezember 2006
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full">
                <Calendar className="text-blue-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Wuchedag</h2>
            </div>
            <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
              {dayOfWeek}
            </p>
            <p className="text-gray-600 mt-2">
              Du bisch an emene {dayOfWeek} uf d'Welt cho! 🎂
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-200 rounded-full">
                <Star className="text-purple-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Stärnezeiche</h2>
            </div>
            <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text">
              Schütze ♐
            </p>
            <p className="text-gray-600 mt-2">
              Abentürlich, optimistisch und liebesvoll! ❤️
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-indigo-100 to-blue-200 rounded-full">
                <Moon className="text-indigo-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Mondphase</h2>
            </div>
            <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text">
              Abnehmende Mondsichel 🌘
            </p>
            <p className="text-gray-600 mt-2">
              E Ziit vo Reflexion und innerem Wachstum
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-rose-100 to-pink-200 rounded-full">
                <Heart className="text-rose-600" size={32} fill="currentColor" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Ziit uf dere Welt</h2>
            </div>
            <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text">
              {new Date().getFullYear() - 2006} Jahr
            </p>
            <p className="text-gray-600 mt-2">
              Und jedes Jahr macht dich no schpezielle! 💕
            </p>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-xl p-8 border-2 border-yellow-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-yellow-100 to-orange-200 rounded-full">
              <Sparkles className="text-orange-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Was isch a dem Tag passiert?</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              </div>
              <p className="text-gray-700">
                <span className="font-bold">🎬 Film:</span> "Eragon" isch i de Kinos usa cho - e Fantasy-Abenteuer wie dini eigeni Gschicht!
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              </div>
              <p className="text-gray-700">
                <span className="font-bold">🌍 Welt:</span> D'Schweiz het an dem Tag ire Schönheit gfiirt - genau wie du!
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              </div>
              <p className="text-gray-700">
                <span className="font-bold">⭐ Nummer 1 Hit:</span> "Irreplaceable" vo Beyoncé - genau wie du für mich bisch!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 border-2 border-blue-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-200 rounded-full">
              <Users className="text-blue-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Berühmti Lüüt mit dim Geburtstag</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl shadow-md">
              <p className="font-bold text-lg text-gray-800">Nostradamus</p>
              <p className="text-gray-600">Astrologe & Prophet (1503)</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-md">
              <p className="font-bold text-lg text-gray-800">Vanessa Hudgens</p>
              <p className="text-gray-600">Schauspielerin & Sängerin (1988)</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-md">
              <p className="font-bold text-lg text-gray-800">Dilma Rousseff</p>
              <p className="text-gray-600">Präsidentin vo Brasilien (1947)</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-md">
              <p className="font-bold text-lg text-gray-800">Du! 💖</p>
              <p className="text-gray-600">Di allerliebschti Person (2006)</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-8 shadow-lg">
          <Heart className="text-pink-500 mx-auto mb-4" size={48} fill="currentColor" />
          <p className="text-xl text-gray-700 font-medium">
            Vo allne Täg im Jahr het sich dä Tag als de schönschte uusgsuecht - <br />
            wil du uf d'Welt cho bisch! 💝
          </p>
        </div>
      </div>
    </div>
  );
};

export default BirthdayFacts;
