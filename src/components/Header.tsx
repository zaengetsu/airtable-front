"use client";

import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Projets', href: '/' },
  { name: 'Nouveau projet', href: '/projects/new', requireAuth: true },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
        <nav className="mx-auto max-w-7xl p-6 text-white">
          <span>Chargement...</span>
        </nav>
      </header>
    );
  }

  const filteredNavigation = navigation.filter(item =>
    !item.requireAuth || (item.requireAuth && isAuthenticated)
  );

  const displayName = user?.name || user?.username || 'Utilisateur';

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Portfolio</span>
            <span className="text-2xl font-bold text-white">Portfolio</span>
          </Link>
        </div>

        {/* Bouton mobile */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
          >
            <span className="sr-only">Ouvrir le menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Liens desktop */}
        <div className="hidden lg:flex lg:gap-x-12">
          {filteredNavigation.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold text-white hover:text-blue-200 transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Actions user desktop */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm font-semibold text-white">Bonjour, {displayName}</span>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm font-semibold text-white hover:text-blue-200 transition-colors duration-200"
                >
                  Administration
                </Link>
              )}
              <button
                onClick={() => { logout(); router.refresh(); }}
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus:outline-none"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-white hover:text-blue-200 transition-colors duration-200"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus:outline-none"
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Menu mobile */}
      <Dialog open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} className="lg:hidden">
        <div className="fixed inset-0 z-10 bg-black/20" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Portfolio</span>
              <span className="text-2xl font-bold text-blue-600">Portfolio</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 p-2.5 text-gray-700"
            >
              <span className="sr-only">Fermer</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-200/50">
              <div className="space-y-2 py-6">
                {filteredNavigation.map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-blue-50 transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                {isAuthenticated ? (
                  <>
                    <div className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900">
                      Bonjour, {displayName}
                    </div>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-blue-50 transition-colors duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Administration
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                        router.refresh();
                      }}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-blue-50 transition-colors duration-200"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-blue-50 transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/register"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-blue-50 transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Inscription
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
