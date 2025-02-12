/**
 * @copyright Copyright (c) 2020 Daniel Kesselberg <mail@danielkesselberg.de>
 *
 * @author Daniel Kesselberg <mail@danielkesselberg.de>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { randHash } from '../utils/'
const randUser = randHash()

describe('Open mp3 and ogg audio in viewer', function() {
	before(function() {
		// Init user
		cy.nextcloudCreateUser(randUser, 'password')
		cy.login(randUser, 'password')

		// Upload test file
		cy.uploadFile('audio.mp3', 'audio/mpeg')
		cy.uploadFile('audio.ogg', 'audio/ogg')
		cy.visit('/apps/files')

		// wait a bit for things to be settled
		cy.wait(1000)
	})
	after(function() {
		cy.logout()
	})

	it('See audios in the list', function() {
		cy.get('.files-fileList tr[data-file="audio.mp3"]', { timeout: 10000 })
			.should('contain', 'audio.mp3')
		cy.get('.files-fileList tr[data-file="audio.ogg"]', { timeout: 10000 })
			.should('contain', 'audio.ogg')
	})

	it('Open the viewer on file click', function() {
		cy.openFile('audio.mp3')
		cy.get('body > .viewer').should('be.visible')
	})

	it('See the menu icon and title on the viewer header', function() {
		cy.get('body > .viewer .modal-title').should('contain', 'audio.mp3')
		cy.get('body > .viewer .modal-header button.action-item__menutoggle').should('be.visible')
		cy.get('body > .viewer .modal-header button.header-close').should('be.visible')
	})

	it('Does see next navigation arrows', function() {
		cy.get('body > .viewer .modal-container audio').should('have.length', 2)
		cy.get('body > .viewer .modal-container .viewer__file.viewer__file--active audio')
			.should('have.attr', 'src')
			.and('contain', `/remote.php/dav/files/${randUser}/audio.mp3`)
		cy.get('body > .viewer button.next').should('be.visible')
		cy.get('body > .viewer button.next').should('be.visible')
	})

	it('Does not see a loading animation', function() {
		cy.get('body > .viewer', { timeout: 10000 })
			.should('be.visible')
			.and('have.class', 'modal-mask')
			.and('not.have.class', 'icon-loading')
	})

	it('Take screenshot 1', function() {
		cy.screenshot()
	})

	it('Show audio.ogg on next', function() {
		cy.get('body > .viewer button.next').click()
		cy.get('body > .viewer .modal-container audio').should('have.length', 2)
		cy.get('body > .viewer .modal-container .viewer__file.viewer__file--active audio')
			.should('have.attr', 'src')
			.and('contain', `/remote.php/dav/files/${randUser}/audio.ogg`)
		cy.get('body > .viewer button.prev').should('be.visible')
		cy.get('body > .viewer button.next').should('be.visible')
	})

	it('Does not see a loading animation', function() {
		cy.get('body > .viewer', { timeout: 10000 })
			.should('be.visible')
			.and('have.class', 'modal-mask')
			.and('not.have.class', 'icon-loading')
	})

	it('Take screenshot 2', function() {
		cy.screenshot()
	})
})
